import axios from 'axios';

const UserRoleChecker = async ({ username }) => {
  try {
    const response = await axios.get(`/api/userInfo/checkUserRole`, {
      params: { username: username },
    });
    return response.data; // Adjust based on your API response structure
  } catch (error) {
    console.error('Error checking user role:', error);
    throw error;
  }
};

export default UserRoleChecker;
