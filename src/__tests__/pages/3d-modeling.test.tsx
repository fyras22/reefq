import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThreeDModelingPage from '@/app/3d-modeling/page';

// Mock dynamic import
jest.mock('next/dynamic', () => {
  const dynamicMock = jest.fn(() => {
    const MockComponent = (props: any) => (
      <div data-testid="mock-jewelry-viewer">
        Metal: {props.metalType}, Gem: {props.gemType}, Size: {props.size}
      </div>
    );
    return MockComponent;
  });
  
  return {
    __esModule: true,
    default: dynamicMock
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, ...props }: React.PropsWithChildren<{}>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.PropsWithChildren<{}>) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: React.PropsWithChildren<{}>) => <div {...props}>{children}</div>,
  },
}));

describe('3D Modeling Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with default props', () => {
    render(<ThreeDModelingPage />);
    
    // Check if the page title is rendered
    expect(screen.getByText('3D Jewelry Modeling')).toBeInTheDocument();
    
    // Check if the 3D viewer is rendered with default props
    const viewer = screen.getByTestId('mock-jewelry-viewer');
    expect(viewer).toHaveTextContent('Metal: gold');
    expect(viewer).toHaveTextContent('Gem: diamond');
    expect(viewer).toHaveTextContent('Size: 1');
  });

  it('updates metal type when selecting from dropdown', () => {
    render(<ThreeDModelingPage />);
    
    // Find the metal type dropdown using selectors instead of label
    const metalDropdown = screen.getAllByRole('combobox')[0]; // First dropdown is metal type
    
    // Change the selection to "silver"
    fireEvent.change(metalDropdown, { target: { value: 'silver' } });
    
    // Check if the 3D viewer is updated
    const viewer = screen.getByTestId('mock-jewelry-viewer');
    expect(viewer).toHaveTextContent('Metal: silver');
  });

  it('updates gem type when selecting from dropdown', () => {
    render(<ThreeDModelingPage />);
    
    // Find the gem type dropdown using selectors instead of label
    const gemDropdown = screen.getAllByRole('combobox')[1]; // Second dropdown is gem type
    
    // Change the selection to "ruby"
    fireEvent.change(gemDropdown, { target: { value: 'ruby' } });
    
    // Check if the 3D viewer is updated
    const viewer = screen.getByTestId('mock-jewelry-viewer');
    expect(viewer).toHaveTextContent('Gem: ruby');
  });

  it('updates size when adjusting the slider', () => {
    render(<ThreeDModelingPage />);
    
    // Find the size slider using selectors instead of label
    const sizeSlider = screen.getByRole('slider');
    
    // Change the slider value to 1.2
    fireEvent.change(sizeSlider, { target: { value: '1.2' } });
    
    // Check if the 3D viewer is updated
    const viewer = screen.getByTestId('mock-jewelry-viewer');
    expect(viewer).toHaveTextContent('Size: 1.2');
  });

  it('renders all feature sections', () => {
    render(<ThreeDModelingPage />);
    
    // Check if all feature sections are rendered
    expect(screen.getByText('Realistic Materials')).toBeInTheDocument();
    expect(screen.getByText('Interactive Controls')).toBeInTheDocument();
    expect(screen.getByText('Custom Options')).toBeInTheDocument();
  });
}); 