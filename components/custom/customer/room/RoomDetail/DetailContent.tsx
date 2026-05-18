import React from 'react'
import DetailDesc from './DetailDesc'
import DetailFacility from './DetailFacility'
import DetailCost from './DetailCost'
import DetailMap from './DetailMap'
import DetailFeedback from './DetailFeedback'

const DetailContent = () => {
  return (
    <div className="space-y-10">
      <DetailDesc />
      <DetailFacility />
      <DetailCost />
      <DetailMap />
    </div>
  );
};

export default DetailContent;