import React, { useState } from 'react';
import { Card, Container, Carousel, Row, Col, Button, ButtonGroup } from 'react-bootstrap';

import { Link } from 'react-router-dom';


const GamingCategories = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

//   return (
//     <div style={{ width: '100%', marginRight: 'auto' }}>
//      <Carousel activeIndex={index} onSelect={handleSelect} indicators={true}>
//         <Carousel.Item>
//           <Row className="justify-content-center">
//             <Col md={6} lg={5}>
//               <Link to="/productsScreen/?search=headsets">
//                 <div className="category-item d-flex justify-content-center align-items-center">
//                   <img className="d-block w-150" style={{ height: '400px' }} src="/images/headset.jpg" alt="Headset" />
//                 </div>
//               </Link>
//             </Col>
//           </Row>
//         </Carousel.Item>
//         <Carousel.Item>
//           <Row className="justify-content-center">
//             <Col md={6} lg={5}>
//               <Link to="/productsScreen/?search=keyboard">
//                 <div className="category-item d-flex justify-content-center align-items-center">
//                   <img className="d-block w-150" style={{ height: '400px' }} src="/images/keyboard.jpg" alt="Keyboard" />
//                 </div>
//               </Link>
//             </Col>
//           </Row>
//         </Carousel.Item>
//         <Carousel.Item>
//           <Row className="justify-content-center">
//             <Col md={6} lg={5}>
//               <Link to="/productsScreen/?search=Graphics%20Card">
//                 <div className="category-item d-flex justify-content-center align-items-center">
//                   <img className="d-block w-150" style={{ height: '400px' }} src="/images/GraphicsCard.jpg" alt="Graphics Card" />
//                 </div>
//               </Link>
//             </Col>
//           </Row>
//         </Carousel.Item>
//         <Carousel.Item>
//           <Row className="justify-content-center">
//             <Col md={6} lg={5}>
//               <Link to="/productsScreen/?search=MotherBoard">
//                 <div className="category-item d-flex justify-content-center align-items-center">
//                   <img className="d-block w-150" style={{ height: '400px' }} src="/images/MotherBoard.jpg" alt="Motherboard" />
//                 </div>
//               </Link>
//             </Col>
//           </Row>
//         </Carousel.Item>
//       </Carousel>
//     </div>
//   );
// };

// return (
//   <Container>
//     <Row className="justify-content-center">
//       <Col md={4}>
//         <Card className="mb-4">
//           <Card.Body className="text-center">
//             <Card.Title>Shop CPUs</Card.Title>
//             <Card.Img variant="top" src="/images/cpuPic.png" alt="CPU" style={{  width: '100px', height: 'auto', objectFit: 'cover' }} />
//           </Card.Body>
//         </Card>
//       </Col>
//       <Col md={4}>
//         <Card className="mb-4">
//           <Card.Body className="text-center">
//             <Card.Title>Shop Graphics Cards</Card.Title>
//             <Card.Img variant="top" src="/images/GpuPic.png" alt="Graphics Cards" style={{  width: '100px', height: 'auto', objectFit: 'cover' }} />
//           </Card.Body>
//         </Card>
//       </Col>
//       <Col md={4}>
//         <Card className="mb-4">
//           <Card.Body className="text-center">
//             <Card.Title>Shop RAM</Card.Title>
//             <Card.Img variant="top" src="/images/ramPic.png" alt="RAM" style={{  width: '100px', height: 'auto', objectFit: 'cover' }} />
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//   </Container>
// );
// };
// return (
//   <Container className="my-5">
//     <Row className="justify-content-center">
//       <Col md={4} className="mb-4">
//         <Card className="h-100 shadow-sm border-0 custom-card bg-secondary">
//           <Card.Body className="text-center">
//             <Card.Title className="custom-title mb-3">Shop CPUs</Card.Title>
//             <Card.Img 
//               variant="top" 
//               src="/images/cpuPic.png" 
//               alt="CPU" 
//               className="custom-img"
//               style={{ width: '100px', height: 'auto' }}
//             />
//           </Card.Body>
//         </Card>
//       </Col>
//       <Col md={4} className="mb-4">
//         <Card className="h-100 shadow-sm border-0 custom-card bg-secondary">
//           <Card.Body className="text-center">
//             <Card.Title className="custom-title mb-3">Shop Graphics Cards</Card.Title>
//             <Card.Img 
//               variant="top" 
//               src="/images/GpuPic.png" 
//               alt="Graphics Cards" 
//               className="custom-img"
//               style={{ width: '100px', height: 'auto' }}
//             />
//           </Card.Body>
//         </Card>
//       </Col>
//       <Col md={4} className="mb-4">
//         <Card className="h-100 shadow-sm border-0 custom-card bg-secondary">
//           <Card.Body className="text-center">
//             <Card.Title className="custom-title mb-3">Shop RAM</Card.Title>
//             <Card.Img 
//               variant="top" 
//               src="/images/ramPic.png" 
//               alt="RAM" 
//               className="custom-img"
//               style={{ width: '100px', height: 'auto' }}
//             />
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//   </Container>
// );
// };
// return (
//   <Container className="my-5">
//     <Row className="justify-content-center">
//       <Col md={6} className="mb-4">
//         <Card className="h-100 shadow-sm border-0 custom-card bg-white">
//           <Card.Body className="text-center">
//             <Card.Title className="custom-title mb-3">Shop CPUs</Card.Title>
//             <Card.Img 
//               variant="top" 
//               src="/images/cpuPic.png" 
//               alt="CPU" 
//               className="custom-img"
//               style={{ width: '100px', height: 'auto' }}
//             />
//           </Card.Body>
//         </Card>
//       </Col>
//       <Col md={6} className="mb-4">
//         <Card className="h-100 shadow-sm border-0 custom-card bg-white">
//           <Card.Body className="text-center">
//             <Card.Title className="custom-title mb-3">Shop Graphics Cards</Card.Title>
//             <Card.Img 
//               variant="top" 
//               src="/images/GpuPic.png" 
//               alt="Graphics Cards" 
//               className="custom-img"
//               style={{ width: '100px', height: 'auto' }}
//             />
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//     <Row className="justify-content-center">
//       <Col md={6} className="mb-4">
//         <Card className="h-100 shadow-sm border-0 custom-card bg-white">
//           <Card.Body className="text-center">
//             <Card.Title className="custom-title mb-3">Shop RAM</Card.Title>
//             <Card.Img 
//               variant="top" 
//               src="/images/ramPic.png" 
//               alt="RAM" 
//               className="custom-img"
//               style={{ width: '100px', height: 'auto' }}
//             />
//           </Card.Body>
//         </Card>
//       </Col>
//       <Col md={6} className="mb-4">
//         <Card className="h-100 shadow-sm border-0 custom-card bg-white">
//           <Card.Body className="text-center">
//             <Card.Title className="custom-title mb-3">Shop Motherboards</Card.Title>
//             <Card.Img 
//               variant="top" 
//               src="/images/motherBoardpic.png" 
//               alt="Motherboards" 
//               className="custom-img"
//               style={{ width: '100px', height: 'auto' }}
//             />
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//   </Container
// );
// };
return (
  <Container className="my-5">
    <Row className="justify-content-center">
      <Col md={6} className="mb-4">
        <Link to="/productsScreen/?search=processor" className="card-link">
          <Card className="h-100 shadow-sm border-0 custom-card bg-white glow-on-hover">
            <Card.Body className="text-center">
              <Card.Title className="custom-title mb-3">Shop CPUs</Card.Title>
              <Card.Img 
                variant="top" 
                src="/images/cpuPic.png" 
                alt="CPU" 
                className="custom-img"
                style={{ width: '100px', height: 'auto' }}
              />
            </Card.Body>
          </Card>
        </Link>
      </Col>
      <Col md={6} className="mb-4">
        <Link to="/productsScreen/?search=graphics%20card" className="card-link">
          <Card className="h-100 shadow-sm border-0 custom-card bg-white glow-on-hover">
            <Card.Body className="text-center">
              <Card.Title className="custom-title mb-3">Shop Graphics Cards</Card.Title>
              <Card.Img 
                variant="top" 
                src="/images/GpuPic.png" 
                alt="Graphics Cards" 
                className="custom-img"
                style={{ width: '100px', height: 'auto' }}
              />
            </Card.Body>
          </Card>
        </Link>
      </Col>
    </Row>
    <Row className="justify-content-center">
      <Col md={6} className="mb-4">
        <Link to="/productsScreen/?search=ram" className="card-link">
          <Card className="h-100 shadow-sm border-0 custom-card bg-white glow-on-hover">
            <Card.Body className="text-center">
              <Card.Title className="custom-title mb-3">Shop RAM</Card.Title>
              <Card.Img 
                variant="top" 
                src="/images/ramPic.png" 
                alt="RAM" 
                className="custom-img"
                style={{ width: '100px', height: 'auto' }}
              />
            </Card.Body>
          </Card>
        </Link>
      </Col>
      <Col md={6} className="mb-4">
        <Link to="/productsScreen/?search=motherboard" className="card-link">
          <Card className="h-100 shadow-sm border-0 custom-card bg-white glow-on-hover">
            <Card.Body className="text-center">
              <Card.Title className="custom-title mb-3">Shop Motherboards</Card.Title>
              <Card.Img 
                variant="top" 
                src="/images/motherBoardpic.png" 
                alt="Motherboards" 
                className="custom-img"
                style={{ width: '100px', height: 'auto' }}
              />
            </Card.Body>
          </Card>
        </Link>
      </Col>
    </Row>
  </Container>
);
};

export default GamingCategories;

///// commmenttttttttttttttt