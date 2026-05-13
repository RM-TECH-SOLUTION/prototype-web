import React, { useMemo } from "react";
import useSessionStore from "../store/useSessionStore";
import "./GreetingComponent.css";

const GreetingComponent = ({ greetingConfig = {} }) => {
  const { user, profileData } = useSessionStore();

  const displayName =
    profileData?.name ||
    user?.name ||
    profileData?.full_name ||
    user?.full_name ||
    "";

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
      <h3 className="greeting-text">
        {displayName ? `${message}, ${displayName}` : message}
      </h3>
      {description && <p className="sub-text">{description}</p>}
    </div>
  );
};

export default GreetingComponent;

