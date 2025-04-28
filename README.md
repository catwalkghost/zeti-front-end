# Bob's Taxis - Vehicle Usage Billing Application

A React application that calculates and displays a bill for Bob's Taxis based on their fleet's vehicle usage. The application displays vehicle data and calculates the mileage costs.

## Screenshots

### Desktop View
![Desktop view of the application](https://github.com/user-attachments/assets/20b18d6f-b4b3-4919-8da6-b22799b53607)

### Tablet view

![Tablet view of the application](https://github.com/user-attachments/assets/ca3c30a9-ccae-479c-a78d-1575ef04404d)

### Mobile View

![Mobile view of the application](https://github.com/user-attachments/assets/28439a52-b268-4701-8ff7-761ebe37262c)
![Mobile view of the application](https://github.com/user-attachments/assets/79706bb3-3a86-4fea-bc5c-58a49acf4da8)


## Requirements

* Node.js >= 16
* Yarn (preferred) or npm

## Installation

Clone the repository and install dependencies:

```bash
# Using yarn (preferred)
yarn install

# Using npm (alternative)
npm install
```

## Running the Application

To start the development server:

```bash
# Using yarn (preferred)
yarn dev

# Using npm (alternative)
npm run dev
```

The application will be available at http://localhost:5174.

## Building for Production

```bash
# Using yarn (preferred)
yarn build

# Using npm (alternative)
npm run build
```

## CORS Handling

This application fetches data from the Azure-hosted API at `https://funczetiinterviewtest.azurewebsites.net/api/`. Since the API doesn't have CORS headers enabled, the application uses a CORS proxy to solve cross-origin issues:

* The app uses `https://api.allorigins.win/raw?url=` as a CORS proxy
* API requests are routed through this proxy service
* The proxy adds the necessary CORS headers to the responses
* This allows the browser to accept the cross-origin responses

### Why CORS is Necessary

CORS (Cross-Origin Resource Sharing) is a security feature implemented by web browsers that restricts web pages from making requests to a different domain than the one that served the original page. This security mechanism helps prevent malicious websites from accessing sensitive data from other websites.

Without proper CORS headers, the browser blocks JavaScript from accessing responses to cross-origin HTTP requests. Since our front-end application is hosted on a different domain than the API server, CORS headers are required to allow this communication. The proxy approach used in this application provides a workaround when we don't have control over the API server's CORS configuration.

This approach enables direct API access without requiring backend changes.

## Usage

The application automatically calculates how much Bob's Taxis owes for the mileage their vehicles covered between February 1, 2021 and February 28, 2021. The bill is displayed on screen with vehicle details.

Users can download the bill in several formats using the format selector dropdown:
* PDF
* CSV
* JSON
* HTML
* XML
* Plain Text

## Performance Optimization

This application uses several performance optimization techniques:

1. **Component Splitting**: Components are split into smaller, focused components to improve maintainability and performance.

2. **Responsive Design**: Different components are rendered based on screen size (mobile, tablet, desktop).

3. **Caching**: API responses are cached to prevent redundant network requests.

4. **Debounced API Calls**: API calls are debounced to prevent excessive requests when a function is called repeatedly.

5. **Conditional Rendering**: Components are only rendered when needed, based on the application state.

## Dependencies

* **React**: UI library
* **Material UI**: Component library
* **dayjs**: Date handling
* **lodash-es**: Utility functions (debounce)
* **jspdf & jspdf-autotable**: PDF generation

## Development Notes

* TypeScript is used for type safety across the project
* Components use the latest React patterns including hooks
* State is managed locally within components
* Material UI theming is used for consistent styling
* Type definitions use the `type` keyword rather than `interface` when possible
* API code is separated from UI code for better maintainability
* FormatSelector component uses strictly typed BillFormat enum to ensure type safety when selecting bill formats

## Testing

This project uses Vitest as the test runner with React Testing Library for component testing. To run tests:

```bash
# Using yarn (preferred)
yarn test

# Using npm (alternative)
npm test
```

### Testing Approach

The testing strategy follows these principles:

1. **Component Testing**: Each component is tested in isolation to ensure it renders correctly and functions as expected.

2. **Unit Testing**: Utility functions, particularly the BillFormatter, are tested to verify correct output formats.

3. **Integration Testing**: Where appropriate, components are tested with their child components to ensure proper integration.

4. **Behavior Testing**: Tests focus on user behavior rather than implementation details, making tests more resilient to refactoring.

### Testing Tools

* **Vitest**: Modern, fast test runner compatible with the Vite build system
* **React Testing Library**: Encourages testing components as users would interact with them
* **jsdom**: Provides a simulated DOM environment for tests
* **Testing-Library Matchers**: Used for common assertions like element presence

### Test Structure

Tests are organized in the `src/tests` directory, with test files named after the component or utility they test (e.g., `VehicleList.test.tsx`). Each test file contains multiple test cases grouped using `describe` blocks.

### Testing Best Practices

1. **Accessibility-First Testing**: Tests should help ensure the application is accessible to all users.

2. **Test User Behavior**: Tests should focus on what users do, not implementation details.

3. **Mock External Dependencies**: API calls are mocked to make tests deterministic and fast.

4. **Descriptive Test Names**: Test names should clearly describe the expected behavior being tested.

5. **DRY Test Code**: Helper functions are used to reduce repetition in tests.

### Test Coverage Improvements Needed

* Add tests for API service modules
* Add more integration tests for combined component behavior
* Implement end-to-end tests for critical user flows
* Add snapshot tests for components with complex UI

## Design Considerations

1. **Vehicle Identification**: The VIN (Vehicle Identification Number) is used as the primary identifier for vehicles as it's unique and more reliable than a license plate, which can be changed.

2. **Error Handling**: The application handles various edge cases such as:
   * Missing vehicle data
   * Missing odometer readings
   * Negative distance calculations (which shouldn't occur in reality)
   * HTTP errors when fetching from the API

3. **Performance Optimization**:
   * Caching is used to store API responses
   * Debouncing is implemented to prevent excessive API calls

4. **Extensibility**:
   * The application is designed to be easily extended to support additional output formats
   * The billing calculator can be modified to support different pricing models

## Edge Cases Considered

* Missing or incomplete vehicle data
* Different odometer readings (start > end, which shouldn't occur in reality)
* API failures and HTTP error responses
* Vehicles that don't belong to Bob's Taxis
* Multiple vehicles with the same license plate but different VINs

## Recent Changes

* Fixed type compatibility issue between BillGeneratorHeader and FormatSelector components by updating FormatSelectorProps to use the BillFormat enum instead of string
* Improved type safety throughout the application by using strict type checking
* Updated file structure to follow a more modular organization with components under dedicated directories
* Fixed and improved test structure using Vitest

## Things to Improve

* Test coverage might be more comprehensive
* Excessive reliance on the `sx` prop. This can be solved by a more comprehensive theme override
* Date picker needs to be introduced for a real-world use case. For test purposes, I am using hardcoded values
* The UI might require more iterations and might benefit from custom images and icons
