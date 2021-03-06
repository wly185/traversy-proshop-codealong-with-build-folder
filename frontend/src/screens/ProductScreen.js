import React, { Fragment, useState, useEffect } from 'react';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form
} from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, createReview } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';
import { addToCart } from '../actions/cartActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';
import Meta from '../components/Meta';

const ProductScreen = ({ match }) => {
  const productId = match.params.id;
  const dispatch = useDispatch();
  const history = useHistory();

  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails;

  const reviewCreate = useSelector((state) => state.reviewCreate);
  const {
    loading: loadingReview,
    error: errorReview,
    success: successReview
  } = reviewCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (successReview) {
      alert('review submitted!');
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [match, dispatch, successReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
    dispatch(addToCart(productId, qty));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createReview(match.params.id, { rating, comment }));
  };

  return (
    <>
      <Meta title={product.name} />
      <Link to='/' className='btn btn-light my-3'>
        go back
      </Link>
      {loading && <Loader />}
      {error && <Message variant='danger'>{error}</Message>}
      {product && (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid></Image>
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={product.numReviews}
                  ></Rating>
                </ListGroup.Item>{' '}
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Quantity:</Col>
                    <Col>
                      {product.countInstock > 0 ? 'out of stock' : 'in stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={qty}
                          onChange={(e) => {
                            setQty(e.target.value);
                          }}
                        >
                          {[...Array(product.countInStock).keys()].map((i) => {
                            return (
                              <option key={i} value={i + 1}>
                                {i + 1}
                              </option>
                            );
                          })}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    onClick={(e) => addToCartHandler(e)}
                    className='btn-block'
                    type='button'
                    disabled={product.countInStock === 0}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>reviews</h2>
              {loadingReview && <Loader />}
              {product.reviews.length === 0 && <Message>no reviews</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating}>
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </Rating>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>write a customer review</h2>
                  {errorReview && (
                    <Message color='danger'>{errorReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>select...</option>
                          <option value='1'>1 - poor</option>
                          <option value='2'>2 - fair</option>
                          <option value='3'>3 - good</option>
                          <option value='4'>4 - very good</option>
                          <option value='5'>5 - excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label controlId='comment'>comment</Form.Label>
                        <Form.Control
                          as='textArea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type='submit' variant='primary'>
                        submit
                      </Button>
                    </Form>
                  ) : (
                    <Message variant='danger'>
                      <Link to='/login'>sign in to write a review</Link>
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
