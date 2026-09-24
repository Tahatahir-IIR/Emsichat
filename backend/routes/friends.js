// routes/friends.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust path as necessary

// Send friend request
router.post('/invite', async (req, res) => {
    const { senderMail, receiverMail } = req.body;

    try {
        const sender = await User.findOne({ mail: senderMail });
        const receiver = await User.findOne({ mail: receiverMail });

        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Initialize arrays if not present
        if (!sender.sentRequests) sender.sentRequests = [];
        if (!receiver.pendingRequests) receiver.pendingRequests = [];
        if (!receiver.friends) receiver.friends = [];

        // Check if friend request already exists
        if (receiver.pendingRequests.includes(sender._id) || sender.sentRequests.includes(receiver._id)) {
            return res.status(409).json({ message: 'Friend request already sent' });
        }

        // Check if already friends
        if (receiver.friends.includes(sender._id)) {
            return res.status(409).json({ message: 'Already friends' });
        }

        // Add to pending and sent requests
        receiver.pendingRequests.push(sender._id);
        sender.sentRequests.push(receiver._id);

        await receiver.save();
        await sender.save();

        res.status(200).json({ message: 'Friend request sent' });

    } catch (err) {
        console.error('Error during friend request:', err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

router.get('/pending/:userMail', async (req, res) => {
    const { userMail } = req.params;

    try {
        const user = await User.findOne({ mail: userMail }).populate('pendingRequests', 'username mail');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const pendingInvitations = user.pendingRequests.map(pendingUser => ({
            _id: pendingUser._id,
            senderId: {
                username: pendingUser.username,
                mail: pendingUser.mail,
            },
        }));

        res.status(200).json(pendingInvitations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch pending invitations', error: err.message });
    }
});

// Accept a friend request
router.post('/accept', async (req, res) => {
    const { currentUserMail, senderId } = req.body;

    try {
        const currentUser = await User.findOne({ mail: currentUserMail });
        const senderUser = await User.findById(senderId);

        if (!currentUser || !senderUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Avoid duplicates in friends list
        if (!currentUser.friends.includes(senderUser._id)) {
            currentUser.friends.push(senderUser._id);
        }

        if (!senderUser.friends.includes(currentUser._id)) {
            senderUser.friends.push(currentUser._id);
        }

        // Remove sender from pendingRequests
        currentUser.pendingRequests = currentUser.pendingRequests.filter(
            (id) => id.toString() !== senderId
        );

        await currentUser.save();
        await senderUser.save();

        res.status(200).json({ message: 'Friend request accepted' });

    } catch (err) {
        console.error('Error accepting friend request:', err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});


// Reject a friend request
router.post('/reject', async (req, res) => {
    const { currentUserMail, senderId } = req.body;

    try {
        const currentUser = await User.findOne({ mail: currentUserMail });

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove sender from pendingRequests
        currentUser.pendingRequests = currentUser.pendingRequests.filter(
            (id) => id.toString() !== senderId
        );

        await currentUser.save();

        res.status(200).json({ message: 'Friend request rejected' });
    } catch (err) {
        console.error('Reject error:', err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

// Get friends of a user
router.get('/friends/:mail', async (req, res) => {
    const { mail } = req.params;
  
    try {
      const user = await User.findOne({ mail }).populate('friends', 'username mail');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user.friends);
    } catch (err) {
      console.error('Error fetching friends:', err);
      res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
  });
  


module.exports = router;
