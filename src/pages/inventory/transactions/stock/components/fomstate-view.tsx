import React, { useState } from 'react';

interface ObjectViewerProps {
  value: any;
  label?: string;
  expandByDefault?: boolean;
}

const ObjectViewer: React.FC<ObjectViewerProps> = ({ value, label = '', expandByDefault = false }) => {
  const [isExpanded, setIsExpanded] = useState(expandByDefault);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (value == null || ['string', 'number', 'boolean'].includes(typeof value)) {
    return (
      <div>
        {label && <strong>{label}: </strong>}
        {value === null ? null :value===""?"": value}
      </div>
    );
  } else if (Array.isArray(value)) {
    return (
      <div>
        <div onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          {label && <strong>{label}: </strong>}
          [] ({value.length}) {isExpanded ? '▼' : '▶'}
        </div>
        {isExpanded && (
          <div style={{ marginLeft: '20px' }}>
            {value.map((item, index) => (
              <ObjectViewer key={index} value={item} label={String(index)} />
            ))}
          </div>
        )}
      </div>
    );
  } else if (typeof value === 'object') {
    return (
      <div>
        <div onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          {label && <strong>{label}: </strong>}
          obj({Object.keys(value).length}) {isExpanded ? '▼' : '▶'}
        </div>
        {isExpanded && (
          <div style={{ marginLeft: '20px' }}>
            {Object.entries(value).map(([key, val]) => (
              <ObjectViewer key={key} value={val} label={key} />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        {label && <strong>{label}: </strong>}
        [Unknown type]
      </div>
    );
  }
};

export default ObjectViewer;