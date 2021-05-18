import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
// import logo from "../../../assets/images/logo.png";
import { Col } from "reactstrap";

const CarouselPage = () => {
  return (
    <React.Fragment>
      <Col xl={9}>
        <div className="auth-full-bg pt-lg-5 p-4">
          <div className="w-100">
            <div className="bg-overlay"></div>
            <div className="d-flex h-100 flex-column">
              <div className="py-5 px-4 mt-auto">
                <div className="row justify-content-center">
                  <div className="col-lg-7">
                    <div className="text-center">
                      <h4 className="mb-1">
                        <i className="bx bxs-quote-alt-left text-primary h1 align-middle mr-3"></i>
                        <h1 className="text-primary">Мон Ном</h1>
                        <span className="text-light">
                          Админы удирдлагын вэб
                        </span>
                      </h4>
                      {/* <Carousel showThumbs={false} className="slider_css">
												<div>
													<div className="item">
														<div className="py-3">
															<p className="font-size-16 mb-4"></p>

															<div>
																<h4 className="font-size-16 text-primary">
																	Abs1981
																</h4>
																<p className="font-size-14 mb-0">
																	- Skote User
																</p>
															</div>
														</div>
													</div>
												</div>
												<div>
													<div className="item">
														<div className="py-3">
															<p className="font-size-16 mb-4">
																"If Every Vendor on Envato are as supportive as
																Themesbrand, Development with be a nice
																experience. You guys are Wonderful. Keep us the
																good work. "
															</p>

															<div>
																<h4 className="font-size-16 text-primary">
																	Abs1981
																</h4>
																<p className="font-size-14 mb-0">
																	- Skote User
																</p>
															</div>
														</div>
													</div>
												</div>
											</Carousel> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};
export default CarouselPage;
