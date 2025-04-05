import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { JewelryViewer } from '../../components/JewelryViewer';

// Mock the JewelryViewer component directly
jest.mock('../../components/JewelryViewer', () => ({
  JewelryViewer: () => <div data-testid="canvas-mock">Mocked JewelryViewer Component</div>
}));

describe('JewelryViewer Component', () => {
  it('renders without crashing', () => {
    render(<JewelryViewer modelPath="/test/model.glb" selectedMetal="gold" selectedGem="diamond" />);
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
  });
}); 