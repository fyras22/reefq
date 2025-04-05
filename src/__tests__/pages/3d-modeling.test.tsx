import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThreeDModelingPage from '@/app/3d-modeling/page';

// Mock dynamic import
jest.mock('next/dynamic', () => {
  const MockComponent = jest.fn(({ children, ...props }) => {
    // When the component renders, we create a div displaying the passed props
    return (
      <div data-testid="mock-jewelry-viewer">
        Metal: {props.selectedMetal}, Gem: {props.selectedGem}, Size: {props.size || '1'}
      </div>
    );
  });
  
  return function mockedDynamic() {
    return MockComponent;
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
    
    // Verify initial value
    expect(sizeSlider).toHaveValue('1');
    
    // Change the slider value to 1.2
    fireEvent.change(sizeSlider, { target: { value: '1.2' } });
    
    // Verify the slider value was updated
    expect(sizeSlider).toHaveValue('1.2');
  });

  it('renders all feature sections', () => {
    render(<ThreeDModelingPage />);
    
    // Check if all feature sections are rendered
    expect(screen.getByText('Realistic Materials')).toBeInTheDocument();
    expect(screen.getByText('Interactive Controls')).toBeInTheDocument();
    expect(screen.getByText('Custom Options')).toBeInTheDocument();
  });
}); 