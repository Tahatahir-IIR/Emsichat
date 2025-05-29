import React, { useState, useEffect } from 'react';
import { validateMail } from '../../../utils/Validate';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import InputWithLabel from '../../../components/InputWithLabel';
import CustomPrimaryButton from '../../../components/CustomPrimaryButton';
import { sendFriendInvitation } from '../../../utils/friendService'; // IMPORT THE API CALL

const AddFriendOverlay = ({ isOverlayUp, closeOverlayHandler }) => {
    const [mail, setMail] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Get the sender's email from localStorage
    useEffect(() => {
        const userDetails = localStorage.getItem("user");
        if (userDetails) {
            const user = JSON.parse(userDetails);
            setMail(user.email); // Optional: If you want to pre-fill the sender's email (though not needed here)
        }
    }, []);

    // Validate the input email format
    useEffect(() => {
        setIsFormValid(validateMail(mail));
    }, [mail]);

    // Handle send invitation
    const handleSendInvitation = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const senderMail = user.mail;

        try {
            const response = await sendFriendInvitation({
                senderMail,
                receiverMail: mail,
            });

            if (response.status === 200) {
                setSuccessMessage('Friend request sent successfully!');
                setErrorMessage('');
            }
        } catch (error) {
            setErrorMessage('Failed to send friend request. Please try again.');
            setSuccessMessage('');
        }

        handleCloseOverlay(); // optional: close dialog after sending
    };

    const handleCloseOverlay = () => {
        setMail('');
        setErrorMessage('');
        setSuccessMessage('');
        closeOverlayHandler();
    };

    return (
        <Dialog open={isOverlayUp} onClose={handleCloseOverlay}>
            <DialogTitle>
                <Typography>Invite a friend</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the email address of the friend you want to add
                </DialogContentText>
                <InputWithLabel
                    label="Mail"
                    type="text"
                    value={mail}
                    setValue={setMail}
                    placeholder="Enter email address here"
                    additionalStyle={{
                        marginTop: "12px",
                        marginBottom: "-10px"
                    }}
                />
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            </DialogContent>
            <DialogActions>
                <CustomPrimaryButton
                    onClick={handleSendInvitation}
                    disabled={!isFormValid}
                    label="Send"
                    additionalStyle={{
                        marginLeft: "3%",
                        marginRight: "3%",
                        marginBottom: "10px",
                        width: "94%"
                    }}
                />
            </DialogActions>
        </Dialog>
    );
};

export default AddFriendOverlay;
