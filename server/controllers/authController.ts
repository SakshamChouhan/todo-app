import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'todoapp-secret-key'; // In production, use environment variables

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const userId = user._id?.toString() || '';
      res.status(201).json({
        id: userId,
        name: user.name,
        email: user.email,
        token: generateToken(userId),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error instanceof Error ? error.message : String(error)
    });
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found, checking password');
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for user:', user.email);
    
    // Send successful response
    const userId = user._id?.toString() || '';
    res.json({
      id: userId,
      name: user.name,
      email: user.email,
      token: generateToken(userId),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error instanceof Error ? error.message : String(error)
    });
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore - we will add user to req in auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = user._id?.toString() || '';
    res.json({
      id: userId,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Server error getting user profile',
      error: error instanceof Error ? error.message : String(error)
    });
    next(error);
  }
};