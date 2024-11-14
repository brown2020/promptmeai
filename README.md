# PromptMeAI

PromptMeAI is an AI-powered platform that allows users to interact with multiple AI models simultaneously. The application is designed for those who want to compare the outputs of various models side-by-side in real-time. Additionally, PromptMeAI includes a payment system for purchasing credits, enabling access to premium features and user profile management.

## Features

- **Multi-Model Interaction:** Compare responses from various AI models in a single interface.
- **Payment System:** Integrated Stripe payment for purchasing credits and accessing premium features.
- **User Authentication:** Secure login with Clerk, integrated with Firebase for data management.
- **State Management:** Uses Zustand for managing user state, chat history, payments, and profiles.
- **Markdown Support:** Chat responses are rendered with Markdown for enhanced readability.

## Technologies Used

- **Next.js 14:** Built using the latest features of Next.js with the App Router.
- **Zustand:** State management for React applications.
- **Clerk:** Authentication and session management.
- **Stripe:** Secure payment processing.
- **Firebase:** Database and storage for user data and application content.
- **React-Markdown:** Renders Markdown in chat conversations.

## Getting Started

### Prerequisites

- **Node.js:** Install the latest version of Node.js.
- **API Keys:** Obtain API keys from OpenAI, Anthropic, Google, Mistral, Fireworks, Groq, Clerk, Stripe, and Firebase.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/brown2020/promptmeai.git
   cd promptmeai
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env.local`.
   - Replace placeholder values with your actual API keys and configuration details.

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

### Usage

1. **Chat Interface:** Type inputs and compare AI model responses side-by-side.
2. **Payment System:** Purchase credits through Stripe to unlock premium features.
3. **Profile Management:** Manage your credits and usage through your profile.

## Environment Variables

Ensure your `.env.local` file includes all necessary API keys and configuration settings:

- **API Keys:** For AI models and services.
- **Clerk:** For user authentication.
- **Stripe:** For payment processing.
- **Firebase:** For storing user data and application state.

### Example `.env.local` Configuration

```bash
# Example configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key
MISTRAL_API_KEY=your_mistral_api_key
FIREWORKS_API_KEY=your_fireworks_api_key

NEXT_PUBLIC_STRIPE_PRODUCT_NAME=your_stripe_product_name
NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret_key

NEXT_PUBLIC_FIREBASE_APIKEY=your_firebase_apikey
NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=your_firebase_authdomain
NEXT_PUBLIC_FIREBASE_PROJECTID=your_firebase_projectid
NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=your_firebase_storagebucket
NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=your_firebase_messagingsenderid
NEXT_PUBLIC_FIREBASE_APPID=your_firebase_appid
NEXT_PUBLIC_FIREBASE_MEASUREMENTID=your_firebase_measurementid

FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_CLIENT_ID=your_firebase_client_id
FIREBASE_AUTH_URI=your_firebase_auth_uri
FIREBASE_TOKEN_URI=your_firebase_token_uri
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=your_firebase_auth_provider_cert_url
FIREBASE_CLIENT_CERTS_URL=your_firebase_client_certs_url
FIREBASE_UNIVERSE_DOMAIN=your_firebase_universe_domain
```

## Learn More

To learn more about the technologies used in this project, refer to the following documentation:

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://docs.pmnd.rs)
- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
