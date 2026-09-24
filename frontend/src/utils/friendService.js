import axios from 'axios';
import BASE_URL from "./BASE_URL"

export const sendFriendInvitation = async ({ senderMail, receiverMail }) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/friends/invite`, {
            senderMail,
            receiverMail
        });
        return response;
    } catch (error) {
        console.error("Error sending friend invitation:", error);
        throw error;
    }
};
