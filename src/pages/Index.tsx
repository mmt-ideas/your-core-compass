import ValuesAssessment from "@/components/ValuesAssessment";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Discover Your Core Values | Personal Values Assessment</title>
        <meta 
          name="description" 
          content="Identify your personal values with this interactive assessment. Perfect for executives and leaders seeking authentic self-discovery and clarity in decision-making." 
        />
      </Helmet>
      <ValuesAssessment />
    </>
  );
};

export default Index;
