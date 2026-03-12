import { render, screen } from '@testing-library/react';
import App from './App';

test('renders clinic management system heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Clinic Management System/i);
  expect(headingElement).toBeInTheDocument();
});
