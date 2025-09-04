# AI Lisa - Teaching Assistant

A beautiful React-based chat application featuring AI Lisa, a specialized probability modeling teaching assistant. Built with OpenAI GPT-4o, MongoDB, and a modern black/pink theme.

## ✨ Features

- **AI-Powered Chat**: GPT-4o integration for intelligent responses
- **Image Support**: Drag & drop, paste, or upload images for analysis
- **Math Rendering**: Beautiful LaTeX math formulas with KaTeX
- **Responsive Design**: Modern UI with Tailwind CSS
- **Chat History**: Persistent storage with MongoDB
- **Vector Store Ready**: Prepared for RAG integration

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai_lisa_ta
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_VECTOR_STORE_ID=your_vector_store_id_optional
   ```

5. **Seed the database with Lisa's system prompt**
   ```bash
   cd server
   node seed-agents.js
   cd ..
   ```

6. **Start the application**
   
   **Terminal 1 (Backend):**
   ```bash
   cd server
   npm start
   ```
   
   **Terminal 2 (Frontend):**
   ```bash
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3001`

## 📦 Dependencies

### Frontend Dependencies
```json
{
  "axios": "^1.11.0",
  "katex": "^0.16.22",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-katex": "^3.1.0",
  "react-markdown": "^10.1.0",
  "remark-math": "^6.0.0",
  "rehype-katex": "^7.0.0",
  "uuid": "^11.1.0"
}
```

### Backend Dependencies
```json
{
  "cors": "^2.8.5",
  "dotenv": "^17.2.2",
  "express": "^5.1.0",
  "mongoose": "^8.18.0",
  "multer": "^2.0.2",
  "openai": "^5.19.1",
  "uuid": "^11.1.0"
}
```

### Development Dependencies
```json
{
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0",
  "tailwindcss": "^3.4.0"
}
```

## 🔧 Updating Lisa's System Prompt

To modify Lisa's personality, expertise, or behavior:

1. **Edit the system prompt**
   ```bash
   # Open the seed file
   code server/seed-agents.js
   ```

2. **Modify the `lisaSystemPrompt` variable**
   ```javascript
   const lisaSystemPrompt = `Your new system prompt here...`;
   ```

3. **Update the database**
   ```bash
   cd server
   node seed-agents.js
   cd ..
   ```

4. **Restart the server**
   ```bash
   cd server
   npm start
   ```

### Example System Prompt Structure
```javascript
const lisaSystemPrompt = `You are AI Lisa, a specialized probability modeling teaching assistant.

Your expertise includes:
- Basic probability theory and concepts
- Conditional probability and Bayes' theorem
- Probability distributions (discrete and continuous)
- Statistical modeling and inference

Your teaching style:
- Break down complex concepts into understandable parts
- Use real-world examples and analogies
- Provide step-by-step explanations

When explaining mathematical concepts, format them EXACTLY like this example:

Bayes' theorem is the rule that updates probabilities when you get new info. ✨

Formula:

$$
P(A \\mid B) \\;=\\; \\frac{P(B \\mid A)\\,P(A)}{P(B)}
$$

It says: your belief in event $A$ after seeing evidence $B$ equals how likely $B$ is if $A$ were true, times your prior belief in $A$, normalized by the overall chance of $B$.

IMPORTANT: 
- Always wrap display math in $$...$$ (double dollar signs)
- Always wrap inline math in $...$ (single dollar signs)  
- Use double backslashes \\\\ for LaTeX commands like \\mid, \\frac, etc.
- Make sure there are NO spaces between the dollar signs and the math content

Remember: You're here to make probability modeling accessible and exciting for everyone!`;
```

## 🎨 Customization

### Styling
- **Colors**: Edit `src/index.css` for theme colors
- **Fonts**: Modify font imports in `src/index.css`
- **Layout**: Update Tailwind classes in components

### Math Rendering
- **KaTeX Configuration**: Edit `src/components/ChatBubble.js`
- **Math Styling**: Modify `src/components/ChatBubble.css`

### Image Handling
- **Upload Limits**: Adjust `server/index.js` middleware limits
- **File Types**: Modify `server/routes/upload.js` validation

## 🚀 Deployment on Render

### Backend Deployment

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment**: `Node`

4. **Add environment variables:**
   - `OPENAI_API_KEY`
   - `MONGODB_URI`
   - `OPENAI_VECTOR_STORE_ID` (optional)

### Frontend Deployment

1. **Create a new Static Site on Render**
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Environment**: `Node`

4. **Add environment variables:**
   - `REACT_APP_API_URL` (your backend URL)

### Update Frontend API URL

Before deploying, update the proxy in `package.json`:
```json
{
  "proxy": "https://your-backend-app.onrender.com"
}
```

## 🛠️ Development

### Project Structure
```
ai_lisa_ta/
├── public/                 # Static assets
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── App.js             # Main app component
│   └── index.css          # Global styles
├── server/                # Express backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── seed-agents.js     # Database seeding
├── package.json           # Frontend dependencies
└── README.md              # This file
```

### Available Scripts

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

**Backend:**
- `cd server && npm start` - Start server
- `cd server && node seed-agents.js` - Seed database

## 🐛 Troubleshooting

### Common Issues

1. **Math not rendering**
   - Ensure `rehype-katex` is installed
   - Check that LaTeX is properly formatted with `$$...$$`

2. **Images not uploading**
   - Verify file size limits in `server/index.js`
   - Check CORS settings

3. **Database connection issues**
   - Verify MongoDB URI in `.env`
   - Ensure database is accessible

4. **OpenAI API errors**
   - Check API key validity
   - Verify rate limits

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the console logs
- Ensure all dependencies are installed correctly