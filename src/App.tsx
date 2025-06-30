import "./App.css";
import SearchBox from "./components/sidebar/SearchBox";
import logo from "./styles/hf-logo.svg";
import TeamFilter from "./components/sidebar/TeamFilter";
import EmployeeList from "./components/sidebar/EmployeeList";
import OrgChartLib from "./components/orgchart/OrgChartLib";
import ChartEditor from "./components/orgchart/ChartEditor";
import ResponsiveLayout from "./components/layout/ResponsiveLayout";

import { EmployeeProvider } from "./context/EmployeeProvider";

function App() {
    const sidebarContent = (
        <div className="sidebar">
			<img src={logo} alt="Company Logo" className="sidebar-logo" />
            <SearchBox />
            <TeamFilter />
            <EmployeeList />
        </div>
    );

    const mainContent = (
        <OrgChartLib>
            <ChartEditor />
        </OrgChartLib>
    );

    return (
        <EmployeeProvider>
            <ResponsiveLayout 
                logo={logo}
                sidebar={sidebarContent}
                main={mainContent}
            />
        </EmployeeProvider>
    );
}

export default App;
