import { Content, Grid, Column, Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import FormDemo from './FormDemo';
import ChatbotDemo from './ChatbotDemo';
import './App.scss';

function App() {
  return (
    <Content className="app-content">
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <h1 className="app-title">AILabel oversight levels (O1&ndash;O5)</h1>
          <p className="app-subtitle">
            Same Carbon <code>AILabel</code> component, five different confirmation and
            audit behaviors wrapped around it depending on the risk of the AI action.
          </p>
          <Tabs>
            <TabList aria-label="Demo views">
              <Tab>Form fields</Tab>
              <Tab>Chatbot</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <FormDemo />
              </TabPanel>
              <TabPanel>
                <ChatbotDemo />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Column>
      </Grid>
    </Content>
  );
}

export default App;
