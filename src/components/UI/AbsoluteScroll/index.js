import React, { useState, useEffect, useLayoutEffect } from 'react';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';

let scrollElementCenter = {
  overflowX: 'scroll',
  display: 'flex',
  flexDirection: 'column',
};

let scrollElementParent = {
  paddingTop: '46px',
  paddingLeft: '50px',
};

export const AbsoluteScroll = (props) => {
  const { children } = props;
  const OutlineIcon = React.createRef();

  const [scrollIcon, setScrollIcon] = useState({
    operator: 'add',
    preVal: 0,
    icon: '',
  });

  useEffect(() => {
    if (!(OutlineIcon.current.scrollWidth > OutlineIcon.current.clientWidth)) {
      setScrollIcon({ ...scrollIcon, icon: '' });
      scrollElementCenter = { ...scrollElementCenter, alignItems: 'center' };
      scrollElementParent = { ...scrollElementParent, paddingLeft: 0 };
    } else {
      setScrollIcon({
        ...scrollIcon,
        icon: <RightOutlined style={{ color: '#ffff' }} />,
      });
      scrollElementCenter = { ...scrollElementCenter, alignItems: 'unset' };
      scrollElementParent = { ...scrollElementParent, paddingLeft: '50px' };
    }
  }, []);

  const scrollIconHandler = () => {
    let interval = setInterval(() => {
      if (!OutlineIcon.current) {
        clearInterval(interval);
        return;
      }
      let temp = OutlineIcon.current.scrollLeft;
      scrollIcon.operator === 'add'
        ? (OutlineIcon.current.scrollLeft += 25)
        : (OutlineIcon.current.scrollLeft -= 25);
      if (OutlineIcon.current.scrollLeft === temp) {
        clearInterval(interval);
        scrollIcon.operator === 'add'
          ? setScrollIcon({
              preVal: OutlineIcon.current.scrollLeft,
              operator: 'sub',
              icon: <LeftOutlined style={{ color: '#ffff' }} />,
            })
          : setScrollIcon({
              preVal: OutlineIcon.current.scrollLeft,
              operator: 'add',
              icon: <RightOutlined style={{ color: '#ffff' }} />,
            });
      } else if (
        (scrollIcon.operator === 'add' &&
          OutlineIcon.current.scrollLeft >= scrollIcon.preVal + 250) ||
        (scrollIcon.operator === 'sub' &&
          OutlineIcon.current.scrollLeft <= scrollIcon.preVal - 250)
      ) {
        clearInterval(interval);
        setScrollIcon({
          ...scrollIcon,
          preVal: OutlineIcon.current.scrollLeft,
        });
      }
    }, 10);
  };

  return (
    <div style={{ ...scrollElementParent }}>
      <div
        onScroll={(e) => {
          if (
            e.target.scrollLeft === 0 &&
            OutlineIcon.current.scrollWidth > OutlineIcon.current.clientWidth
          ) {
            setScrollIcon({
              preVal: OutlineIcon.current.scrollLeft,
              operator: 'add',
              icon: <RightOutlined style={{ color: '#ffff' }} />,
            });
          } else if (
            e.target.scrollWidth - 1 <=
              e.target.scrollLeft + e.target.clientWidth &&
            OutlineIcon.current.scrollWidth > OutlineIcon.current.clientWidth
          ) {
            setScrollIcon({
              preVal: OutlineIcon.current.scrollLeft,
              operator: 'sub',
              icon: <LeftOutlined style={{ color: '#ffff' }} />,
            });
          }
        }}
        className="scrollElement"
        style={{ ...scrollElementCenter }}
        ref={OutlineIcon}
      >
        <div
          style={{
            position: 'fixed',
            top: '5%',
            ...(scrollIcon.operator === 'add' && { right: '10px' }),
            bottom: 0,
            margin: 'auto',
            zIndex: '11',
            height: '32px',
            ...(scrollIcon.operator === 'sub' && { left: '23%' }),
          }}
        >
          <Button
            style={{ background: '#b2b2b2', height: '42px', width: '42px' }}
            shape="circle"
            icon={scrollIcon.icon}
            onClick={() => scrollIconHandler()}
          />
        </div>
        {children}
      </div>
    </div>
  );
};
