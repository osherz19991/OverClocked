import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChartComponent from '../Components/ChartComponet';
import { Spinner } from 'react-bootstrap';
import UserRoleChecker from '../Components/UserRoleChecker';

const AdminScreen = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('normal');
  const [purchases, setPurchases] = useState([]);
  const [userDistribution, setUserDistribution] = useState({ new: 2, normal: 3, admin: 1 });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productCategoriesData, setProductCategoriesData] = useState([]);

  useEffect(() => {
    const checkUserRole = async () => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        try {
          const role = await UserRoleChecker({ username: storedUsername });
          setUserRole(role);
          if (role !== 'admin') {
            alert('You have no access to this page. Redirecting to Home Page.');
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          navigate('/');
        }
      } else {
        alert('No username found. Redirecting to Home Page.');
        navigate('/');
      }
    };

    checkUserRole();
  }, [navigate]);

  useEffect(() => {
    if (userRole === 'admin') {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [statsRes] = await Promise.all([
            axios.get('/api/admin')
          ]);

          setUserDistribution(statsRes.data.userDistribution);
          setProductCategoriesData(statsRes.data.pieChartData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole === 'admin') {
      const fetchPurchases = async () => {
        try {
          const response = await axios.get(`/api/admin/lastYear`);
          setPurchases(response.data);
        } catch (error) {
          console.error('Error fetching purchases:', error);
        }
      };
      fetchPurchases();
    }
  }, [userRole]);

  const handleTimeIntervalChange = async (timeInterval) => {
    try {
      const response = await axios.get(`/api/admin/${timeInterval}`);
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedFile) {
      console.error('Please select a CSV file to import products.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('products', selectedFile);

      const response = await axios.post('/api/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Products imported successfully:', response.data);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Dashboard</h1>
      {loading && <Spinner animation="border" style={{ display: 'block', margin: 'auto' }} />}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <input type="file" accept=".csv" onChange={handleFileChange} style={{ marginRight: '10px' }} />
        <button onClick={handleAddProduct} style={{ padding: '10px 20px', cursor: 'pointer' }}>Import Products from csv file to DataBase</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ border: '2px solid #ccc', borderRadius: '10px', padding: '20px', flex: '1 1 25%' }}>
          <h2 style={{ textAlign: 'center' }}>Most Selling Categories</h2>
          <ChartComponent
            data={{
              labels: productCategoriesData.labels || [],
              datasets: productCategoriesData.datasets && productCategoriesData.datasets.length > 0 ? [{
                label: 'Purchase Category',
                data: productCategoriesData.datasets[0].data || [],
                backgroundColor: productCategoriesData.datasets[0].backgroundColor || [],
                borderWidth: 1
              }] : []
            }}
            chartType="pie"
            width={400}
            height={400 * (2 / 3)}
          />
        </div>

        <div style={{ border: '2px solid #ccc', borderRadius: '10px', padding: '20px', flex: '1 1 25%' }}>
          <h2 style={{ textAlign: 'center' }}>User Distribution</h2>
          <ChartComponent
            data={{
              labels: ['New Users (Last 7 Days)', 'Normal Users', 'Admin Users'],
              datasets: [{
                label: 'User Distribution',
                data: [userDistribution.new, userDistribution.normal, userDistribution.admin],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 206, 86, 0.7)'
                ],
                borderWidth: 1
              }]
            }}
            chartType="pie"
            width={400}
            height={400 * (2 / 3)}
          />
        </div>
      </div>

      <div style={{ border: '2px solid #ccc', borderRadius: '10px', padding: '20px', flex: '1 1 100%', marginTop: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Purchase Data</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => handleTimeIntervalChange('lastDay')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Last Day</button>
          <button onClick={() => handleTimeIntervalChange('lastWeek')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Last Week</button>
          <button onClick={() => handleTimeIntervalChange('lastMonth')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Last Month</button>
          <button onClick={() => handleTimeIntervalChange('lastYear')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Last Year</button>
        </div>
        <ChartComponent
          data={{
            labels: purchases.map(purchase => purchase.purchaseDate.split('T')[0]),
            datasets: [{
              label: 'Amount of Money Earned',
              data: purchases.map(purchase => purchase.totalPrice),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 1
            }]
          }}
          chartType="line"
          width={800}
          height={400 * (2 / 3)}
        />
      </div>
    </div>
  );
};

export default AdminScreen;
