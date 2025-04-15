import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { CartContext } from '../../context/cart';
import { formatPrice } from '../../lib/utils';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'Test description that is long enough to be truncated',
  category: { name: 'Test Category' },
  images: ['test-image-1.jpg', 'test-image-2.jpg']
};

const mockCartContext = {
  items: [],
  addItem: jest.fn(),
  totalAmount: 0,
  totalQuantity: 0,
  decreaseQuantity: jest.fn(),
  removeItem: jest.fn()
};

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (product = mockProduct, contextValue = mockCartContext) => {
    return render(
      <CartContext.Provider value={contextValue}>
        <ProductCard product={product} />
      </CartContext.Provider>
    );
  };

  it('renders product details correctly', () => {
    renderComponent();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(formatPrice(99.99))).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  

  it('toggles description visibility', () => {
    renderComponent();
    const description = screen.getByText('Test description that is long enough to be truncated');
    const descriptionContainer = description.closest('div.group');
    fireEvent.click(descriptionContainer);

    expect(description).toHaveClass('text-gray-500');
    expect(description).not.toHaveClass('line-clamp-2');
  });

  it('adds product to cart', async () => {
    renderComponent();
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    
    fireEvent.click(addButton);
    expect(mockCartContext.addItem).toHaveBeenCalledWith(mockProduct);
    
    expect(screen.getByText('Adding...')).toBeInTheDocument();
    
  
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
    });
    
    const loadingState = screen.queryByText('Adding...');
    expect(loadingState).not.toBeInTheDocument();
    mockCartContext.items = [mockProduct];
    renderComponent(mockProduct, mockCartContext);
  
    const updatedButton = screen.getByText('Added to Cart').closest('button');
    expect(updatedButton).toBeDisabled();
  });
});