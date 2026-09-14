import { Tabs, TabList, Tab, TabPanels, TabPanel } from './brandsync/Tabs';
import FormDemo from './FormDemo';
import ChatbotDemo from './ChatbotDemo';
import DashboardDemo from './DashboardDemo';
import HealthcareDemo from './HealthcareDemo';
import SocialServicesDemo from './SocialServicesDemo';
import './App.scss';

function App() {
  return (
    <div className="app-content">
      <h1 className="app-title">AILabel oversight levels (O1&ndash;O5)</h1>
      <p className="app-subtitle">
        Same AI-disclosure pattern, five different confirmation and
        audit behaviors wrapped around it depending on the risk of the AI action.
      </p>
      <Tabs>
        <TabList aria-label="Demo views">
          <Tab>Form fields</Tab>
          <Tab>Chatbot</Tab>
          <Tab>Dashboard</Tab>
          <Tab>Healthcare</Tab>
          <Tab>Social services</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormDemo />
          </TabPanel>
          <TabPanel>
            <ChatbotDemo />
          </TabPanel>
          <TabPanel>
            <DashboardDemo />
          </TabPanel>
          <TabPanel>
            <HealthcareDemo />
          </TabPanel>
          <TabPanel>
            <SocialServicesDemo />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default App;
