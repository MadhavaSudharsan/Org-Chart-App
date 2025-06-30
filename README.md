# Organization Chart Application

A modern, responsive organization chart application built with React, TypeScript, and interactive features for employee management.

![Organization Chart App](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

- **📊 Interactive Organization Chart**: Visual hierarchy with drag & drop functionality
- **📱 Responsive Design**: Optimized for both desktop and mobile devices
- **👥 Employee Management**: Add, edit, delete, and update employee information
- **🔍 Advanced Search**: Real-time search across names, designations, and teams
- **🏷️ Team Filtering**: Filter employees by department/team
- **🖼️ Avatar Management**: Upload and manage employee profile pictures
- **⚡ Real-time Updates**: Instant UI updates with persistent storage
- **🎯 CEO Protection**: Restricted editing for executive roles
- **📐 Zoom Controls**: Zoom in/out and reset chart view
- **💾 Auto-Save**: Automatic data persistence to localStorage

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0 + TypeScript
- **State Management**: Context API with useReducer
- **UI Components**: Custom components with Lucide React icons
- **Chart Library**: @dabeng/react-orgchart
- **Drag & Drop**: react-dnd with HTML5 backend
- **Mock API**: MirageJS for development
- **Styling**: CSS-in-JS with responsive design
- **Testing**: Jest + React Testing Library

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: For cloning the repository

Check your versions:
```bash
node --version
npm --version
git --version
```

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/org-chart-app.git
cd org-chart-app/org-chart-app
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- TypeScript
- @dabeng/react-orgchart
- MirageJS for mock API
- Lucide React for icons
- react-dnd for drag & drop
- And other development dependencies

### 3. Verify Installation
```bash
npm list --depth=0
```

## 🏃‍♂️ Running the Application

### Development Mode
Start the development server:
```bash
npm start
```

The application will automatically:
- ✅ Start on [http://localhost:3000](http://localhost:3000)
- ✅ Open in your default browser
- ✅ Enable hot-reloading for development
- ✅ Initialize MirageJS mock server
- ✅ Load sample employee data

### Production Build
Create an optimized production build:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Testing
Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 📱 Application Usage

### Desktop Features
- **Sidebar Navigation**: Employee list with search and filtering
- **Drag & Drop**: Move employees between managers
- **Chart Editor**: Add/remove employees and modify relationships
- **Zoom Controls**: Located in bottom-right corner
- **Employee Editing**: Click pencil icon to edit employee details

### Mobile Features
- **Collapsible Header**: Tap to expand employee management
- **Touch-Optimized**: Large buttons and touch-friendly interface
- **Mobile Zoom Controls**: Located in bottom-left with editor button
- **Responsive Layout**: Optimized for mobile screen sizes

### Key Interactions
1. **Search Employees**: Type in search box to filter by name, role, or team
2. **Filter by Team**: Select team from dropdown to view specific departments
3. **Edit Employee**: Click pencil icon → modify details → save changes
4. **Drag & Drop**: Drag employee cards to reassign managers
5. **Add Employees**: Use chart editor to add children, siblings, or parents
6. **Remove Employees**: Select employee → use remove option in chart editor

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory (optional):
```env
REACT_APP_TITLE=Organization Chart
REACT_APP_VERSION=1.0.0
```

### Customization Options
- **Chart Appearance**: Modify `orgchartOverrides.css`
- **Color Scheme**: Update primary colors in component styles
- **Sample Data**: Edit `src/api/server.ts` to change initial employee data
- **Responsive Breakpoints**: Adjust mobile breakpoint in responsive components

## 📂 Project Structure

```
org-chart-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── common/           # Reusable components
│   │   ├── layout/           # Layout components
│   │   ├── mobile/           # Mobile-specific components
│   │   ├── orgchart/         # Chart-related components
│   │   └── sidebar/          # Sidebar components
│   ├── context/              # React Context providers
│   │   └── EmployeeProvider.tsx
│   ├── api/                  # API layer
│   │   ├── employeeApi.ts
│   │   └── server.ts         # MirageJS mock server
│   ├── models/               # TypeScript interfaces
│   ├── utils/                # Utility functions
│   ├── hooks/                # Custom React hooks
│   ├── styles/               # CSS and assets
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: `npm start` fails with dependency errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: TypeScript compilation errors
```bash
# Solution: Check TypeScript version compatibility
npm install typescript@^4.9.5
```

**Issue**: Chart not displaying properly
- Ensure browser supports ES6+ features
- Check console for JavaScript errors
- Verify all dependencies are installed

**Issue**: Mobile layout not responsive
- Clear browser cache
- Check viewport meta tag in index.html
- Verify CSS media queries are loading

### Performance Tips
- Use Chrome DevTools for performance profiling
- Monitor bundle size with `npm run build`
- Check for memory leaks in drag & drop operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Add tests for new features
- Update documentation for API changes

## 🙏 Acknowledgments

- **@dabeng/react-orgchart** for the chart visualization library
- **Lucide React** for beautiful icons
- **MirageJS** for seamless API mocking
- **React DnD** for drag and drop functionality

## 📞 Support

For support and questions:
- 📧 Email: madhavasudharsan05@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/org-chart-app/issues)
- 📖 Documentation: [Wiki](https://github.com/your-username/org-chart-app/wiki)

---

**Built using React + TypeScript**
