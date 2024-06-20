import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';


const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    digit: false,
  });

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      digit: /\d/.test(password),
    };
    setPasswordValidations(validations);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to the signup endpoint
      const response = await axios.post('/api/signup', {
        name: username,
        email: email,
        password: password,
        isAdmin: false,
      });

      console.log('User signed up successfully:', response.data);
      setSignupSuccess(true);
      localStorage.setItem('username', username);
      navigate('/'); // Redirect to home page after successful signup
    } catch (error) {
      console.error('Error signing up:', error.response.data);
      setError(error.response.data.error); // Set error message received from the server
    }
  };
  return (
    <Card style={{ maxWidth: '300px', margin: '0 auto', padding: '20px' }}>
      <h2>Sign Up</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <div>
            <p style={{ color: passwordValidations.length ? 'green' : 'red' }}>
              {passwordValidations.length ? '✔' : '✘'} At least 8 characters
            </p>
            <p style={{ color: passwordValidations.upper ? 'green' : 'red' }}>
              {passwordValidations.upper ? '✔' : '✘'} At least one uppercase letter
            </p>
            <p style={{ color: passwordValidations.lower ? 'green' : 'red' }}>
              {passwordValidations.lower ? '✔' : '✘'} At least one lowercase letter
            </p>
            <p style={{ color: passwordValidations.digit ? 'green' : 'red' }}>
              {passwordValidations.digit ? '✔' : '✘'} At least one digit
            </p>
          </div>
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button type="submit">Sign Up</Button>
      </Form>
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </Card>
  );
};

//   return (
//     <div style={styles.signupContainer}>
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSubmit}>
//         <div style={styles.formGroup}>
//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             style={styles.input}
//           />
//         </div>
//         <div style={styles.formGroup}>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={styles.input}
//           />
//         </div>
//         <div style={styles.formGroup}>
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={handlePasswordChange}
//             required
//             style={styles.input}
//           />
//           <div style={styles.passwordCriteria}>
//             <p style={{ color: passwordValidations.length ? 'green' : 'red' }}>
//               {passwordValidations.length ? '✔' : '✘'} At least 8 characters
//             </p>
//             <p style={{ color: passwordValidations.upper ? 'green' : 'red' }}>
//               {passwordValidations.upper ? '✔' : '✘'} At least one uppercase letter
//             </p>
//             <p style={{ color: passwordValidations.lower ? 'green' : 'red' }}>
//               {passwordValidations.lower ? '✔' : '✘'} At least one lowercase letter
//             </p>
//             <p style={{ color: passwordValidations.digit ? 'green' : 'red' }}>
//               {passwordValidations.digit ? '✔' : '✘'} At least one digit
//             </p>
//           </div>
//         </div>
//         {error && <div style={styles.errorMessage}>{error}</div>} {/* Display error message if present */}
//         <button type="submit" style={styles.signupButton}>Sign Up</button>
//       </form>
//       <p>
//         Already have an account? <Link to="/signin">Sign In</Link>
//       </p>
//     </div>
//   );
// };


export default SignupScreen;
