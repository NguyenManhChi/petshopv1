import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatbotAPI } from '../../api/chatbot';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial greeting when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadInitialGreeting();
    }
  }, [isOpen]);

  const loadInitialGreeting = async () => {
    try {
      const response = await chatbotAPI.getPopularProducts();
      const botMessage = {
        type: 'bot',
        text: response.data.message,
        products: response.data.products,
        timestamp: new Date(),
      };
      setMessages([botMessage]);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Failed to load initial greeting:', error);
      setMessages([
        {
          type: 'bot',
          text: 'Xin chào! Tôi có thể giúp bạn tìm sản phẩm gì hôm nay?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: messageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Call API
      const response = await chatbotAPI.searchProducts(messageText);

      // Add bot response
      setTimeout(() => {
        const botMessage = {
          type: 'bot',
          text: response.data.message,
          products: response.data.products,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setSuggestions(response.data.suggestions || []);
        setIsTyping(false);
      }, 800); // Simulate typing delay
    } catch (error) {
      console.error('Failed to search products:', error);
      setTimeout(() => {
        const errorMessage = {
          type: 'bot',
          text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 800);
    }
  };

  const handleSuggestionClick = suggestion => {
    handleSendMessage(suggestion);
  };

  const handleProductClick = productId => {
    navigate(`/products/${productId}`);
    setIsOpen(false);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatPrice = price => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="chatbot-container">
      {/* Floating Button */}
      {!isOpen && (
        <button
          className="chatbot-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chatbot"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          {messages.length === 0 && (
            <span className="notification-badge">!</span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🐾</div>
              <div className="chatbot-header-text">
                <h3>PetShop AI Assistant</h3>
                <p>Trợ lý tìm kiếm thông minh</p>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index}>
                <div className={`message-bubble ${message.type}`}>
                  <p>{message.text}</p>
                </div>

                {/* Show products if available */}
                {message.products && message.products.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    {message.products.map(product => {
                      const price = product.price || product.product_buy_price || 0;
                      const discount = product.discount_amount || 0;
                      const finalPrice = price - discount;
                      const hasDiscount = discount > 0;

                      return (
                        <div
                          key={product.id}
                          className="chat-product-card"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <img
                            src={
                              product.image_url ||
                              '/placeholder-product.png'
                            }
                            alt={product.product_name}
                            className="chat-product-image"
                          />
                          <div className="chat-product-info">
                            <p className="chat-product-name">
                              {product.product_name}
                            </p>
                            <p
                              className={`chat-product-price ${hasDiscount ? 'discount' : ''}`}
                            >
                              {formatPrice(finalPrice)}
                              {hasDiscount && (
                                <span className="chat-product-old-price">
                                  {formatPrice(price)}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Show suggestions */}
                {message.type === 'bot' &&
                  index === messages.length - 1 &&
                  suggestions.length > 0 && (
                    <div className="chatbot-suggestions">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="suggestion-chip"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Mô tả sản phẩm bạn muốn tìm..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <button
              className="chatbot-send-button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
