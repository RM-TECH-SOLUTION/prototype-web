import React, { useMemo } from "react";
import "./GreetingComponent.css";

const GreetingComponent = ({ greetingConfig = {} }) => {
  const { message, description } = useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return {
        message: greetingConfig?.morningMessage || "Good Morning",
        description: greetingConfig?.morningMessageDescription || "",
      };
    }

    if (hour >= 12 && hour < 17) {
      return {
        message: greetingConfig?.afternoonMessage || "Good Afternoon",
        description: greetingConfig?.afternoonMessageDescription || "",
      };
    }

    if (hour >= 17 && hour < 21) {
      return {
        message: greetingConfig?.eveningMessage || "Good Evening",
        description: greetingConfig?.eveningMessageDescription || "",
      };
    }

    return {
      message: greetingConfig?.nightMessage || "Good Night",
      description: greetingConfig?.nightMessageDescription || "",
    };
  }, [greetingConfig]);

  return (
    <div className="greeting-container">
      <h3 className="greeting-text">{message}</h3>
      {description && <p className="sub-text">{description}</p>}
    </div>
  );
};

export default GreetingComponent;

