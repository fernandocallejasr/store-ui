import { render, screen } from '@testing-library/react'
import App from './App';

describe('App Component', () => {
	it('should render main title', () => {
		render(<App />);

		const mainTitle = screen.getByText(/Stickers Shop/i);

		expect(mainTitle).toBeInTheDocument();
	});

	it('should render header', () => {
		render(<App />);

		const header = screen.getByRole('banner');

		expect(header).toBeInTheDocument();
	});

	it('should render footer', () => {
		render(<App />);

		const footer = screen.getByRole('contentinfo');

		expect(footer).toBeInTheDocument();
	});

	it('should render product listings', () => {
		render(<App />);

		const productHeadings = screen.getAllByRole('heading', { level: 2 });

		expect(productHeadings.length).toBeGreaterThan(0);
	});
});
