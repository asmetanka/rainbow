import React, { useState, useEffect, useRef, createRef } from 'react';

// Data from tagsData.js
const tagsData = [
  // Rainbow Green (#67CF3A)
  { id: 'ux-design', text: 'UX Design', description: 'Ensures your product is intuitive and effectively solves real user problems. We craft experiences that feel effortless and satisfying, turning complex tools into user-friendly solutions for everyone.', cta: 'Enhance our product UX', group: 'green' },
  { id: 'ui-design', text: 'UI Design', description: "Defines your product's visual appeal and clarity. We design stunning, easy-to-navigate interfaces—with thoughtful layouts, colors, and typography—that make your product a delight to use.", cta: 'Ready for a fresh UI?', group: 'green' },
  { id: 'web-design', text: 'Web Design', description: 'Builds engaging, fast, and responsive websites that shine on all devices. We ensure your content is easy to find, a joy to read, and drives your business goals without user frustration.', cta: 'Strengthen our website', group: 'green' },
  { id: 'mobile-app-design', text: 'Mobile App Design', description: 'Crafts intuitive apps for iOS and Android, perfectly tailored for touchscreens. We use natural gestures and adaptive layouts to make small screens feel spacious and complex tasks feel simple.', cta: 'Considering a mobile app?', group: 'green' },
  { id: 'interaction-design', text: 'Interaction Design (IxD)', description: 'Shapes how your product responds to every tap, swipe, and click. We design fluid interactions and feedback that feel natural and human, making your product engaging and predictable.', cta: 'Refine product interaction flows?', group: 'green' },
  { id: 'visual-design', text: 'Visual Design', description: 'Elevates your brand with a polished, cohesive, and memorable aesthetic. We use strategic spacing, compelling imagery, and refined typography to build instant trust and captivate your audience.', cta: 'Elevate our visual appeal', group: 'green' },
  { id: 'micro-interactions', text: 'Micro-interactions', description: 'Adds subtle yet impactful animations (like button feedback or smooth transitions). These thoughtful details make your product feel more alive, responsive, and delightful to use.', cta: 'Enhance UX with subtle interactions?', group: 'green' },
  // Rainbow Yellow (#F7D80E)
  { id: 'user-research', text: 'User Research', description: 'Uncovers the why behind user actions through interviews, surveys, and observational studies. We replace costly assumptions with actionable insights to build products people actually need and love.', cta: 'Uncover user insights', group: 'yellow' },
  { id: 'usability-testing', text: 'Usability Testing', description: 'Observes real people using your product to identify confusion, obstacles, and areas for improvement. We help you catch and fix issues before launch, saving time and ensuring a smoother user experience.', cta: 'Ready to pinpoint UX issues?', group: 'yellow' },
  { id: 'accessibility', text: 'Accessibility (A11y)', description: 'Ensures your product is usable by everyone, including people with disabilities. We design for screen reader compatibility, color contrast, keyboard navigation, and more—widening your audience and meeting global standards.', cta: 'Make our product truly inclusive', group: 'yellow' },
  { id: 'persona-development', text: 'Persona Development', description: 'Creates vivid profiles of your ideal users—their goals, motivations, pain points, and habits. This anchors every design decision in real human needs, not guesswork.', cta: 'Develop insightful user personas', group: 'yellow' },
  { id: 'user-journeys', text: 'User Journeys', description: "Maps the complete path users take when interacting with your product or service. We pinpoint moments of frustration, delight, and opportunity to optimize their entire experience.", cta: 'Map detailed customer journey paths?', group: 'yellow' },
  { id: 'scenarios', text: 'Scenarios', description: "Develops concise, real-life stories of how different users will interact with your product in various situations. This uncovers practical needs and use cases that data alone can't reveal.", cta: 'Explore user-centric scenarios?', group: 'yellow' },
  // Rainbow Gold (#FFB221)
  { id: 'prototyping', text: 'Prototyping', description: 'Builds interactive, clickable mockups of your product. This allows you to test ideas, user flows, and gather crucial feedback from stakeholders and users—all before writing a single line of code.', cta: 'Prototype ideas before building?', group: 'gold' },
  { id: 'information-architecture', text: 'Information Architecture (IA)', description: "Organizes your product's content and features into a logical, intuitive structure—like a clear blueprint. Helps users find what they need quickly, without getting lost or frustrated.", cta: 'Better ways to organize content?', group: 'gold' },
  { id: 'wireframes', text: 'Wireframes', description: "Creates simple, black & white 'skeletons' of your product's pages or screens. We use them to validate layouts, content hierarchy, and user flows before visual design begins.", cta: 'Outline product with clear wireframes', group: 'gold' },
  { id: 'onboarding-flows', text: 'Onboarding Flows', description: 'Designs a welcoming and effective first-time experience for new users. We guide them to their "Aha!" moment quickly, reducing confusion and significantly boosting long-term retention.', cta: 'Enhance the onboarding experience?', group: 'gold' },
  { id: 'ux-writing', text: 'UX Writing', description: 'Crafts clear, concise, and helpful text for every part of your interface—buttons, labels, error messages, tooltips. Words that guide users and make your product feel supportive and human.', cta: 'Could product wording be clearer?', group: 'gold' },
  // Rainbow Blue (#3560E2)
  { id: 'figma-expertise', text: 'Figma Expertise', description: "Leverages Figma's full potential for real-time design collaboration, prototyping, and streamlined workflows. Keeps stakeholders informed, feedback loops tight, and projects on track.", cta: 'Need expert design in Figma?', group: 'blue' },
  { id: 'agile-design', text: 'Agile Design', description: 'Seamlessly integrates design activities into agile development sprints. We enable early testing, rapid iteration, and continuous adaptation to user feedback—avoiding waterfall delays.', cta: 'Explore agile design processes?', group: 'blue' },
  { id: 'iterative-design', text: 'Iterative Design', description: 'Employs a cyclical process of designing, testing, and refining your product based on user feedback and data. Catches issues early, ensures user alignment, and leads to continuous improvement.', cta: 'Iterate based on user feedback?', group: 'blue' },
  { id: 'lean-product-design', text: 'Lean Product Design', description: "Focuses on building a Minimum Viable Product (MVP) to test core assumptions quickly and efficiently. Builds only what's proven valuable—saving budget, reducing risk, and speeding time-to-market.", cta: 'Adopt a lean design approach', group: 'blue' },
  { id: 'design-sprints', text: 'Design Sprints', description: 'Facilitates intensive, one-week workshops to solve critical business problems: from idea to a tested prototype with real user feedback. Validates high-stakes solutions quickly before major investment.', cta: 'Accelerate with a design sprint?', group: 'blue' },
  { id: 'developer-handoff', text: 'Developer Handoff', description: 'Prepares and delivers design files with meticulous specs, assets, and clear documentation. Ensures developers can build your product accurately and efficiently, minimizing guesswork and revisions.', cta: 'Streamline developer handoff?', group: 'blue' },
  { id: 'co-creation', text: 'Co-creation', description: 'Designs with your team, stakeholders, and even users through collaborative workshops and activities. This builds shared ownership, uncovers deeper insights, and leads to more impactful solutions.', cta: 'Co-create innovative design solutions?', group: 'blue' },
  { id: 'design-workshops', text: 'Design Workshops', description: 'Facilitates structured, outcome-focused sessions to align stakeholders, solve specific challenges, or generate new ideas. Transforms ambiguity into actionable plans and decisions, often in just a few hours.', cta: 'Schedule a collaborative workshop', group: 'blue' },
  // Rainbow Teal (#1FC37E)
  { id: 'design-systems', text: 'Design Systems', description: 'Creates a comprehensive toolkit of reusable UI components, design patterns, and clear guidelines. Ensures brand consistency, accelerates development, and allows your product to scale efficiently.', cta: 'Seeking consistent design at scale?', group: 'teal' },
  { id: 'style-guides', text: 'Style Guides', description: "Documents your brand's official visual and voice principles—logo usage, color palettes, typography, tone. Keeps your entire team (designers, developers, marketers) perfectly aligned.", cta: 'Establish clear style guidelines', group: 'teal' },
  { id: 'component-libraries', text: 'Component Libraries', description: 'Provides a collection of pre-built, tested UI elements (buttons, forms, cards, etc.). Enables your developers to assemble features much faster and with greater consistency.', cta: 'Build a robust component library?', group: 'teal' },
  { id: 'design-tokens', text: 'Design Tokens', description: 'Stores core design attributes (colors, fonts, spacing) as reusable variables in code. Any change to a token updates automatically across all platforms, ensuring perfect consistency with less effort.', cta: 'Standardize our design attributes', group: 'teal' },
  { id: 'scalable-solutions', text: 'Scalable Solutions', description: 'Designs products and systems with future growth in mind. We build flexible foundations that allow you to add features, serve more users, or enter new markets without costly redesigns.', cta: 'Ensure design scales smoothly?', group: 'teal' },
  // Rainbow Orange (#FF6237)
  { id: 'saas-product-design', text: 'SaaS Product Design', description: 'Designs subscription-based software (Software-as-a-Service) focused on user onboarding, long-term engagement, and retention. We help you build intuitive, value-packed platforms that scale smoothly and keep users loyal.', cta: 'Design our SaaS for growth', group: 'orange' },
  { id: 'enterprise-ux', text: 'Enterprise UX', description: 'Tackles design complexity for large organizations: improving legacy systems, streamlining intricate workflows, and ensuring security and compliance. We make sophisticated enterprise tools simple, efficient, and user-friendly for employees.', cta: 'Simplify complex enterprise workflows?', group: 'orange' },
  { id: 'b2c-design', text: 'B2C Design', description: 'Creates engaging digital products and experiences for mass-market consumers. Focuses on intuitive usability, emotional appeal, and seamless interactions that drive adoption, loyalty, and sales.', cta: 'Design for our consumer needs', group: 'orange' },
  { id: 'b2b-design', text: 'B2B Design', description: 'Crafts digital tools and platforms specifically for business-to-business needs: complex workflows, role-based access, data management. Prioritizes efficiency, integration, and clear ROI for your business clients.', cta: 'Looking for impactful B2B solutions?', group: 'orange' },
  { id: 'startup-design', text: 'Startup Design', description: 'Helps new ventures build impactful Minimum Viable Products (MVPs) that validate core ideas quickly and efficiently. We create user-centered solutions designed to attract early adopters and secure investor confidence.', cta: 'Build a standout MVP', group: 'orange' },
  // Rainbow Purple (#845DD9)
  { id: 'brand-identity', text: 'Brand Identity', description: 'Forges your unique visual DNA: memorable logo, distinct colors, and characteristic fonts. Makes your brand instantly recognizable and stand out in a crowded market.', cta: 'Help with our brand identity', group: 'purple' },
  { id: 'product-audit', text: 'Product Audit', description: "Conducts a thorough review of your product's usability, design consistency, and overall user experience. We identify and help fix frustrations that might be costing you users and revenue.", cta: 'Time for a product audit?', group: 'purple' },
  { id: 'design-strategy', text: 'Design Strategy', description: 'Aligns every design decision with your core business objectives. We help prioritize features and experiences that fuel growth, user engagement, and market differentiation.', cta: 'Shape a clear design strategy', group: 'purple' },
  { id: 'consulting-audit', text: 'Consulting & Audit', description: 'Provides expert analysis to uncover hidden risks and growth opportunities within your product or design processes. We deliver actionable insights and clear steps to elevate performance.', cta: 'Request expert design advice', group: 'purple' },
  { id: 'business-driven-design', text: 'Business-Driven Design', description: 'Directly links design choices to tangible business outcomes: boosting conversions, reducing support costs, and fostering long-term customer loyalty. Every pixel serves a purpose.', cta: 'Align design with key business goals', group: 'purple' },
  { id: 'brand-storytelling', text: 'Brand Storytelling', description: 'Transforms your mission and values into compelling narratives. We help you connect emotionally with your audience, building loyalty beyond just a product or service.', cta: 'Tell our brand story effectively', group: 'purple' },
  { id: 'trust-transparency', text: 'Trust & Transparency', description: 'Designs interfaces and experiences that make users feel secure and respected. We champion clear data policies, straightforward pricing, and honest communication—no smoke and mirrors.', cta: 'Build greater user trust?', group: 'purple' },
  // Rainbow Red (#F54242)
  { id: 'dashboards', text: 'Dashboards', description: 'Transforms complex data into clear, scannable, and actionable visual panels. We design dashboards tailored to specific user needs—executives, analysts, or customers—for quick insights and informed decisions.', cta: 'Develop effective dashboards', group: 'red' },
  { id: 'data-visualization', text: 'Data Visualization', description: 'Converts raw numbers and datasets into intuitive charts, graphs, and infographics. We help you and your users spot trends, patterns, and key information at a glance, enabling faster, smarter decisions.', cta: 'Need to visualize complex data?', group: 'red' },
  { id: 'motion-video-design', text: 'Motion & Video Design', description: 'Creates engaging animations for interfaces and short, impactful videos for marketing or tutorials. We make complex ideas easy to understand in seconds and add a layer of professional polish.', cta: 'Bring our products to life', group: 'red' },
  { id: 'pitch-deck-design', text: 'Pitch Deck Design', description: 'Crafts compelling, visually persuasive presentations that tell your unique story to investors or key partners. We combine strong narrative with impactful design to help you secure funding and build support.', cta: 'Craft a compelling pitch deck?', group: 'red' },
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

// Styles from Tags.css
const TagsStyles = () => (
  <style>
    {`
      /* Base container styles with high specificity */
      .tags-component {
          position: relative !important;
          width: 100% !important;
          box-sizing: border-box !important;
      }
      
      .tags-component .demo-section {
          padding: 16px 16px 120px 16px !important;
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box !important;
          background: transparent !important;
      }

      .tags-component .button-container {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box !important;
          text-align: center !important;
          margin-bottom: 40px !important;
      }

      .tags-component .button-wrapper {
          position: relative !important;
          display: inline-block !important;
          z-index: 100 !important;
          margin: 8px !important;
      }

      .tags-component .demo-button {
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

      .tags-component .demo-button.active {
          background: transparent !important;
          color: #010214 !important;
          transform: none !important;
          box-shadow: none !important;
          pointer-events: none !important;
          cursor: default !important;
      }

      .tags-component .description-card {
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

      .tags-component .description-card.show {
          opacity: 1 !important;
          visibility: visible !important;
          z-index: 1001 !important;
      }

      .tags-component .button-wrapper.active {
          z-index: 1000 !important;
      }

      .tags-component .button-wrapper.active .demo-button {
          z-index: 1002 !important;
          position: relative !important;
      }

      .tags-component .description-card p {
          font-family: "Lato", Arial, sans-serif !important;
          font-size: 16px !important;
          font-style: italic !important;
          font-weight: 400 !important;
          margin: 0 0 8px 0 !important;
          color: #010214 !important;
          line-height: 1.5 !important;
          text-align: left !important;
      }

      .tags-component .order-btn {
          margin-top: 16px !important;
          padding: 18px 24px !important;
          border: none !important;
          border-radius: 32px !important;
          background: #9333ea !important;
          color: white !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          display: inline-block !important;
          text-align: center !important;
          white-space: nowrap !important;
          transition: none !important;
          font-family: "Lato", Arial, sans-serif !important;
          text-decoration: none !important;
      }

      .tags-component .order-btn:hover {
          opacity: 0.9 !important;
      }

      /* Mobile responsive styles */
      @media (max-width: 768px) {
          .tags-component .demo-section { 
              padding: 16px !important; 
              border-radius: 16px !important; 
          }
          .tags-component .button-container { 
              width: 100% !important; 
              height: 100% !important; 
          }
          .tags-component .button-wrapper { 
              margin: 6px !important; 
          }
          .tags-component .description-card { 
              min-width: 280px !important; 
              padding: 64px 32px 32px 32px !important;
              text-align: left !important;
          }
          .tags-component .description-card p { 
              font-size: 14px !important; 
              margin: 0 0 24px 0 !important; 
              line-height: 1.4 !important;
              text-align: left !important;
          }
          .tags-component .order-btn {
              margin-top: 8px !important;
              padding: 10px 20px !important;
              font-size: 14px !important;
          }
      }
    `}
  </style>
);

const Tags = () => {
  const [activeId, setActiveId] = useState(null);
  const containerRef = useRef(null);
  const buttonRefs = useRef(tagsData.map(() => createRef()));
  const cardRefs = useRef(tagsData.map(() => createRef()));

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

    const activeIndex = tagsData.findIndex(tag => tag.id === activeId);
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
    const tagInfo = tagsData[activeIndex];
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
            const activeIndex = tagsData.findIndex(tag => tag.id === activeId);
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
      <TagsStyles />
      <div className="tags-component demo-section" ref={containerRef}>
        <div className="button-container">
          {tagsData.map((tag, index) => {
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

export default Tags; 