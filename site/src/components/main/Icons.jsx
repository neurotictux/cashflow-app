import React from 'react'

export const SuccessAnimatedIcon = () => (
  <div className="check_mark">
    <div className="sa-icon sa-success animate">
      <span className="sa-line sa-tip animateSuccessTip"></span>
      <span className="sa-line sa-long animateSuccessLong"></span>
      <div className="sa-placeholder"></div>
      <div className="sa-fix"></div>
    </div>
  </div>
)

export const ErrorAnimatedIcon = () => (
  <div className="error_mark">
    <div className="sa-icon sa-error animate">
      <span className="sa-line sa-tip animateErrorDown"></span>
      <span className="sa-line sa-long animateErrorUp"></span>
      <div className="sa-placeholder"></div>
      <div className="sa-fix"></div>
    </div>
  </div>
)