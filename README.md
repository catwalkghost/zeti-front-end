# Bob's Taxis - Vehicle Usage Billing Application

A React application that calculates and displays a bill for Bob's Taxis based on their fleet's vehicle usage. The application displays vehicle data and calculates the mileage costs.

## Screenshots

### Desktop View
![Desktop view of the bill application](docs/screenshots/desktop-view.png)
![Another desktop view of the bill application](docs/screenshots/desktop-view-2.png)

### Mobile View
![Mobile view of the bill summary](docs/screenshots/mobile-view-1.png)
![Mobile view of vehicle details](docs/screenshots/mobile-view-2.png)

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

## Application Structure

```
src/
├── API/                    # API services for data fetching
│   ├── Bill.ts             # Bill API methods
│   └── Vehicle.ts          # Vehicle API methods with Bob's Taxis filtering
├── Components/             # React components
│   ├── BillGenerator/      # Bill generator component and its parts
│   │   ├── BillGeneratorHeader.tsx    # Header section with format selector
│   │   ├── BillingInformation.tsx     # Footer section with metadata
│   │   └── index.tsx                  # Main bill generator component
│   ├── BillSummary.tsx     # Bill summary component
│   ├── FormatSelector.tsx  # Format selection dropdown
│   └── VehicleList/        # Vehicle list components for different views
│       ├── VehicleListMobile.tsx      # Mobile view with cards
│       ├── VehicleListTablet.tsx      # Tablet view with optimized table
│       └── index.tsx                  # Main responsive vehicle list
├── utils/                  # Utility functions
│   ├── BillingCalculator.ts # Calculates the bill based on vehicle data
│   └── BillFormatter.ts     # Formats the bill in different output formats
├── Types/                  # Type definitions
│   └── index.ts            
├── Constants/              # Application constants
├── theme.ts               # MUI theme configuration
├── App.tsx                # Main application component
└── main.tsx               # Application entry point
```

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

## Tests

Run tests with:

```bash
# Using yarn (preferred)
yarn test

# Using npm (alternative)
npm test
```

## Design Considerations

1. **Vehicle Identification**: The VIN (Vehicle Identification Number) is used as the primary identifier for vehicles as it's unique and more reliable than a license plate, which can be changed.

2. **Error Handling**: The application handles various edge cases such as:
   * Missing vehicle data
   * Missing odometer readings
   * Negative distance calculations (which shouldn't occur in reality)
   * HTTP errors when fetching from the API
   * CORS issues handling through proxy

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
* CORS issues when accessing the API from local development environment
* Vehicles that don't belong to Bob's Taxis
* Multiple vehicles with the same license plate but different VINs
