import axiosInstance from './axiosInstance';

const UserRoleChecker = async ({ username }) => {
  try {
    const response = await axiosInstance.get(`/api/userInfo/checkUserRole`, {
      params: { username: username },
    });
    return response.data; // Adjust based on your API response structure
  } catch (error) {
    console.error('Error checking user role:', error);
    throw error;
  }
};

export default UserRoleChecker;
