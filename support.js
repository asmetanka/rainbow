import React, { useState, useEffect, useRef, createRef } from 'react';

// Data from support.html
const supportData = [
  // Rainbow Green (#67CF3A) - Trust & Value Group
  { id: 'trust', text: 'Trust', description: 'You can count on us to deliver, every time.', cta: 'Build on trust', group: 'green' },
  { id: 'value', text: 'Value', description: 'Brings measurable ROI, every project, every launch.', cta: 'Get real value', group: 'green' },
  { id: 'authenticity', text: 'Authenticity', description: 'Honest, real, and true to your brand.', cta: 'Build authentically', group: 'green' },
  { id: 'quality', text: 'Quality', description: 'No shortcuts, just great work and polish.', cta: 'Demand quality', group: 'green' },
  { id: 'purpose', text: 'Purpose', description: 'Every step tied to your business goals.', cta: 'Define our purpose', group: 'green' },
  
  // Rainbow Yellow (#F7D80E) - Communication Group
  { id: 'clarity', text: 'Clarity', description: 'Clear communication, transparent process, no hidden steps.', cta: 'Work with clarity', group: 'yellow' },
  { id: 'transparency', text: 'Transparency', description: 'Full visibility into process and costs, always.', cta: 'See our process', group: 'yellow' },
  { id: 'guidance', text: 'Guidance', description: 'We lead you through the complex, every step.', cta: 'Need guidance?', group: 'yellow' },
  { id: 'insight', text: 'Insight', description: 'Deep expertise, sharp analysis, strategic perspective.', cta: 'Gain insight', group: 'yellow' },
  { id: 'discovery', text: 'Discovery', description: 'Always searching for new value and insight.', cta: 'Start discovery', group: 'yellow' },
  
  // Rainbow Gold (#FFB221) - Performance Group
  { id: 'reliability', text: 'Reliability', description: 'Consistent performance and on-time delivery, no surprises.', cta: 'Count on reliability', group: 'gold' },
  { id: 'efficiency', text: 'Efficiency', description: 'Less waste, more output, better results.', cta: 'Boost efficiency', group: 'gold' },
  { id: 'results', text: 'Results', description: 'Tangible business outcomes, not just pretty pictures.', cta: 'Focus on results', group: 'gold' },
  { id: 'focus', text: 'Focus', description: 'Prioritizing what drives success, not distractions.', cta: 'Sharpen our focus', group: 'gold' },
  { id: 'detail', text: 'Detail', description: 'We sweat the small stuff — so you don\'t have to.', cta: 'See our detail', group: 'gold' },
  
  // Rainbow Blue (#3560E2) - Growth & Partnership Group
  { id: 'partnership', text: 'Partnership', description: 'Real collaboration, your goals become ours.', cta: 'Let\'s partner up', group: 'blue' },
  { id: 'growth', text: 'Growth', description: 'We help you scale — users, revenue, team.', cta: 'Accelerate growth', group: 'blue' },
  { id: 'collaboration', text: 'Collaboration', description: 'Real teamwork with you, not just for you.', cta: 'Collaborate now', group: 'blue' },
  { id: 'engagement', text: 'Engagement', description: 'High involvement, high ownership, real partnership.', cta: 'Raise engagement', group: 'blue' },
  { id: 'alignment', text: 'Alignment', description: 'Your business, design, and dev all moving together.', cta: 'Stay aligned', group: 'blue' },
  { id: 'learning', text: 'Learning', description: 'Always improving, for us and your team.', cta: 'Grow with us', group: 'blue' },
  
  // Rainbow Teal (#1FC37E) - Innovation & Progress Group
  { id: 'innovation', text: 'Innovation', description: 'New ideas, better solutions, never stuck.', cta: 'Drive innovation', group: 'teal' },
  { id: 'progress', text: 'Progress', description: 'Always moving forward, learning, improving.', cta: 'Keep progressing', group: 'teal' },
  { id: 'adaptability', text: 'Adaptability', description: 'Flexible for new needs and change.', cta: 'Adapt together', group: 'teal' },
  { id: 'connection', text: 'Connection', description: 'Design and tech that bring people together.', cta: 'Strengthen connection', group: 'teal' },
  { id: 'stability', text: 'Stability', description: 'Reliable systems, built to last and scale.', cta: 'Ensure stability', group: 'teal' },
  
  // Rainbow Orange (#FF6237) - Impact & Success Group
  { id: 'impact', text: 'Impact', description: 'Design and tech that actually move the business forward.', cta: 'Maximize our impact', group: 'orange' },
  { id: 'success', text: 'Success', description: 'Your wins = our wins.', cta: 'Let\'s succeed', group: 'orange' },
  { id: 'resilience', text: 'Resilience', description: 'Ready for challenges, built for the long haul.', cta: 'Build resilience', group: 'orange' },
  { id: 'balance', text: 'Balance', description: 'Keeping business, users, and team in sync.', cta: 'Find balance', group: 'orange' },
];

const colorMap = {
    green: { background: '#55AD2F', text: 'white', shadow: '103, 207, 58' },
    yellow: { background: '#CDA502', text: 'white', shadow: '212, 172, 0' },
    gold: { background: '#DBBD29', text: 'white', shadow: '255, 178, 33' },
    blue: { background: '#3560E2', text: 'white', shadow: '53, 96, 226' },
    teal: { background: '#1FC37E', text: 'white', shadow: '31, 195, 126' },
    orange: { background: '#E85A00', text: 'white', shadow: '232, 90, 0' },
    purple: { background: '#845DD9', text: 'white', shadow: '132, 93, 217' },
    red: { background: '#F54242', text: 'white', shadow: '245, 66, 66' },
  };

// Styles from support.html adapted for React
const SupportStyles = () => (
  <style>
    {`
      /* Base container styles with high specificity */
      .support-component {
          position: relative !important;
          width: 100% !important;
          box-sizing: border-box !important;
      }
      
      .support-component .demo-section {
          padding: 16px 16px 120px 16px !important;
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box !important;
          background: transparent !important;
      }

      .support-component .button-container {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box !important;
          text-align: center !important;
          margin-bottom: 40px !important;
      }

      .support-component .button-wrapper {
          position: relative !important;
          display: inline-block !important;
          z-index: 100 !important;
          margin: 8px !important;
      }

      .support-component .demo-button {
          padding: 18px 24px !important;
          border-radius: 40px !important;
          font-weight: 500 !important;
          font-size: 20px !important;
          cursor: pointer !important;
          border: none !important;
          outline: none !important;
          color: white !important;
          position: relative !important;
          z-index: 100 !important;
          pointer-events: auto !important;
          font-family: "Lato", Arial, sans-serif !important;
          display: block !important;
          transition: none !important;
          box-shadow: none !important;
          transform: none !important;
      }

      .support-component .demo-button.active {
          background: transparent !important;
          color: #010214 !important;
          transform: none !important;
          box-shadow: none !important;
          pointer-events: none !important;
          cursor: default !important;
      }

      .support-component .description-card {
          position: absolute !important;
          top: -8px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          background: #e7e5e4 !important;
          color: #010214 !important;
          border-radius: 28px !important;
          padding: 64px 32px 32px 32px !important;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.50), 0 4px 16px rgba(147, 51, 234, 1.0) !important;
          min-width: 320px !important;
          opacity: 0 !important;
          visibility: hidden !important;
          z-index: 50 !important;
          transition: opacity 0.2s ease, visibility 0.2s ease !important;
          pointer-events: auto !important;
          text-align: left !important;
      }

      .support-component .description-card.show {
          opacity: 1 !important;
          visibility: visible !important;
          z-index: 1001 !important;
      }

      .support-component .button-wrapper.active {
          z-index: 1000 !important;
      }

      .support-component .button-wrapper.active .demo-button {
          z-index: 1002 !important;
          position: relative !important;
      }

      .support-component .description-card p {
          font-family: "Lato", Arial, sans-serif !important;
          font-size: 16px !important;
          font-style: italic !important;
          font-weight: 400 !important;
          margin: 0 0 8px 0 !important;
          color: #010214 !important;
          line-height: 1.5 !important;
          text-align: left !important;
      }

      .support-component .order-btn {
          margin-top: 16px !important;
          padding: 18px 24px !important;
          border: none !important;
          border-radius: 32px !important;
          background: #9333ea !important;
          color: white !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          display: block !important;
          width: 100% !important;
          text-align: center !important;
          white-space: nowrap !important;
          transition: none !important;
          font-family: "Lato", Arial, sans-serif !important;
          text-decoration: none !important;
      }

      .support-component .order-btn:hover {
          opacity: 0.9 !important;
      }

      /* Mobile responsive styles */
      @media (max-width: 768px) {
          .support-component .demo-section { 
              padding: 16px !important; 
              border-radius: 16px !important; 
          }
          .support-component .button-container { 
              width: 100% !important; 
              height: 100% !important; 
          }
          .support-component .button-wrapper { 
              margin: 6px !important; 
          }
          .support-component .description-card { 
              min-width: 280px !important; 
              padding: 64px 32px 32px 32px !important;
              text-align: left !important;
          }
          .support-component .description-card p { 
              font-size: 14px !important; 
              margin: 0 0 24px 0 !important; 
              line-height: 1.4 !important;
              text-align: left !important;
          }
          .support-component .order-btn {
              margin-top: 8px !important;
              padding: 10px 20px !important;
              font-size: 14px !important;
          }
      }
    `}
  </style>
);

const Support = () => {
  const [activeId, setActiveId] = useState(null);
  const containerRef = useRef(null);
  const buttonRefs = useRef(supportData.map(() => createRef()));
  const cardRefs = useRef(supportData.map(() => createRef()));

  const handleButtonClick = (id) => {
    const prevActiveId = activeId;
    
    // If clicking the same button, close it
    if (prevActiveId === id) {
      setActiveId(null);
      return;
    }
    
    // Temporarily disable transitions on all buttons
    buttonRefs.current.forEach(ref => {
      if (ref.current) {
        ref.current.style.transition = 'none';
      }
    });
    
    // Set new active state
    setActiveId(id);
    
    // Re-enable transitions after a short delay
    setTimeout(() => {
      buttonRefs.current.forEach(ref => {
        if (ref.current) {
          ref.current.style.transition = '';
        }
      });
    }, 50);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeId === null) return;

    const activeIndex = supportData.findIndex(tag => tag.id === activeId);
    if (activeIndex === -1) return;

    const button = buttonRefs.current[activeIndex]?.current;
    const card = cardRefs.current[activeIndex]?.current;
    const container = containerRef.current;

    if (!button || !card || !container) return;

    // Set minimum width for the card
    const minWidth = Math.max(320, button.offsetWidth);
    card.style.setProperty('min-width', `${minWidth}px`, 'important');

    // Position the card
    const containerRect = container.getBoundingClientRect();
    card.style.setProperty('transform', 'translateX(-50%)', 'important');
    
    // Force a reflow to get accurate measurements
    card.offsetHeight;
    
    const cardRect = card.getBoundingClientRect();

    let transformAdjustmentPx = 0;
    if (cardRect.right > containerRect.right) {
      transformAdjustmentPx = -(cardRect.right - containerRect.right) - 20;
    } else if (cardRect.left < containerRect.left) {
      transformAdjustmentPx = containerRect.left - cardRect.left + 20;
    }
    
    if (transformAdjustmentPx !== 0) {
      card.style.setProperty('transform', `translateX(calc(-50% + ${transformAdjustmentPx}px))`, 'important');
    }

    // Apply color styling
    const ctaButton = card.querySelector('.order-btn');
    const tagInfo = supportData[activeIndex];
    const colors = colorMap[tagInfo.group];

    if (ctaButton && colors) {
      ctaButton.style.setProperty('background', colors.background, 'important');
      ctaButton.style.setProperty('color', colors.text, 'important');
      card.style.setProperty('box-shadow', `0 4px 20px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(${colors.shadow}, 1.0)`, 'important');
    }
  }, [activeId]);
  
  useEffect(() => {
    const handleResize = () => {
        if (activeId) {
            const activeIndex = supportData.findIndex(tag => tag.id === activeId);
            if(activeIndex === -1) return;
            const button = buttonRefs.current[activeIndex]?.current;
            const card = cardRefs.current[activeIndex]?.current;
            const container = containerRef.current;
            if (!button || !card || !container) return;
            
            const containerRect = container.getBoundingClientRect();
            card.style.setProperty('transform', 'translateX(-50%)', 'important');
            
            // Force a reflow
            card.offsetHeight;
            
            const cardRect = card.getBoundingClientRect();

            let transformAdjustmentPx = 0;
            if (cardRect.right > containerRect.right) {
              transformAdjustmentPx = -(cardRect.right - containerRect.right) - 20;
            } else if (cardRect.left < containerRect.left) {
              transformAdjustmentPx = containerRect.left - cardRect.left + 20;
            }
            
            if (transformAdjustmentPx !== 0) {
              card.style.setProperty('transform', `translateX(calc(-50% + ${transformAdjustmentPx}px))`, 'important');
            }
        }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeId]);

  return (
    <>
      <SupportStyles />
      <div className="support-component demo-section" ref={containerRef}>
        <div className="button-container">
          {supportData.map((tag, index) => {
            const isActive = activeId === tag.id;
            const colors = colorMap[tag.group];
            
            return (
              <div
                key={tag.id}
                className={`button-wrapper ${isActive ? 'active' : ''}`}
                style={{ zIndex: 1000 - index }}
              >
                <button
                  ref={buttonRefs.current[index]}
                  className={`demo-button ${isActive ? 'active' : ''}`}
                  id={tag.id}
                  onClick={() => handleButtonClick(tag.id)}
                  style={{
                    ...(isActive 
                      ? { 
                          backgroundColor: 'transparent', 
                          color: '#010214',
                          pointerEvents: 'none',
                          cursor: 'default'
                        }
                      : colors 
                      ? { 
                          backgroundColor: colors.background, 
                          color: colors.text 
                        }
                      : {}
                    )
                  }}
                >
                  {tag.text}
                </button>
                <div
                  ref={cardRefs.current[index]}
                  className={`description-card ${isActive ? 'show' : ''}`}
                  onMouseLeave={() => setActiveId(null)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p dangerouslySetInnerHTML={{ __html: tag.description }} />
                  <button
                    className="order-btn"
                    onClick={() => window.location.hash='order-form'}
                  >
                    {tag.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Support; 