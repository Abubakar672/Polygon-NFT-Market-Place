import styled from "styled-components";
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";

export default function Accordion({ title, icon, children, collapsed }) {
  const [isOpen, setIsOpen] = useState(collapsed ? true : false);

  return (
    <StyledAccordion>
      <AccordionTitle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <div>
          {icon} <h3>{title}</h3>
        </div>
        <button>
          <MdExpandMore size={24} />
        </button>
      </AccordionTitle>
      <AccordionContent isOpen={isOpen}>{children}</AccordionContent>
    </StyledAccordion>
  );
}

const StyledAccordion = styled.div`
  border: 1px solid #e5e8eb;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const AccordionTitle = styled.div`
  cursor: pointer;
  user-select: none;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${(props) => (props.isOpen ? "1px solid #e5e8eb" : "none")};
  div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    svg {
      margin-right: 1rem;
    }
  }
  h3 {
    font-size: 1.2rem;
  }
  button {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    svg {
      transform: rotateZ(${(props) => (props.isOpen ? "180deg" : "0deg")});
    }
  }
`;

const AccordionContent = styled.div`
  padding: 1rem 1.5rem;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  font-size: 0.9rem;
  line-height: 1.5rem;
`;
