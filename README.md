Here's a revised README.md for your `promptmeai` project, designed to be informative and suitable for GitHub:

---

# PromptMeAI

**PromptMeAI** is an advanced AI-powered application that allows users to interact with multiple AI models simultaneously. Whether you're generating text, translating, or creating images, PromptMeAI offers a robust comparison interface to explore various model outputs side-by-side. The application also integrates payment functionality for purchasing credits and managing profiles, using Zustand for state management, Clerk for authentication, and Firebase for data storage.

## Features

- **Multi-Model Chat Comparison**: Interact with and compare responses from different AI models in real-time.
- **Payment Integration**: Purchase credits through a secure Stripe integration to access premium features.
- **User Authentication**: Secure login via Clerk, with seamless Firebase integration for storing user data.
- **State Management**: Zustand is used to manage authentication status, chat history, payments, and user profiles with credits.
- **Markdown Support**: Conversations are displayed with Markdown rendering for enhanced readability.

## Technologies Used

- **Next.js 14**: Built on the latest version of Next.js with the App Router.
- **Zustand**: Lightweight state management for efficient application performance.
- **Clerk**: User authentication and session management.
- **Stripe**: Payment processing and checkout.
- **Firebase**: Database and storage solutions for user data and application content.
- **React-Markdown**: For rendering Markdown in chat conversations.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **API Keys**: Obtain the necessary API keys from OpenAI, Anthropic, Google, Mistral, Fireworks, Groq, Clerk, Stripe, and Firebase.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/promptmeai.git
   cd promptmeai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy the `.env.example` file to `.env.local`.
   - Replace placeholder values with your actual API keys and configuration details:

     ```env
     # API Keys
     OPENAI_API_KEY=your_openai_api_key
     ANTHROPIC_API_KEY=your_anthropic_api_key
     GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key
     MISTRAL_API_KEY=your_mistral_api_key
     FIREWORKS_API_KEY=your_fireworks_api_key
     GROQ_API_KEY=your_groq_api_key

     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_key
     CLERK_SECRET_KEY=your_clerk_secret_key

     NEXT_PUBLIC_STRIPE_PRODUCT_NAME=your_stripe_product_name
     NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
     STRIPE_SECRET_KEY=your_stripe_secret_key

     # Firebase Client Config
     NEXT_PUBLIC_FIREBASE_APIKEY=your_firebase_apikey
     NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=your_firebase_authdomain
     NEXT_PUBLIC_FIREBASE_PROJECTID=your_firebase_projectid
     NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=your_firebase_storagebucket
     NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=your_firebase_messagingsenderid
     NEXT_PUBLIC_FIREBASE_APPID=your_firebase_appid
     NEXT_PUBLIC_FIREBASE_MEASUREMENTID=your_firebase_measurementid

     # Firebase Server Config
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

### Running the Development Server

Start the development server with the following command:

```bash
npm run dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

### Usage

1. **Chat Interface**: Interact with multiple AI models. Type your input in the chat box and compare the responses side-by-side from different models.
2. **Payment System**: Purchase credits securely through the integrated Stripe payment system.
3. **Profile Management**: Track your usage and credit balance through your profile, managed by Zustand and stored in Firebase.

## Environment Variables

Ensure your `.env.local` file includes all necessary API keys and configuration settings:

- **API Keys**: Used to interact with various AI models and services.
- **Clerk**: Handles user authentication.
- **Stripe**: Processes payments.
- **Firebase**: Stores user data and application state.

### Example `.env.local` Configuration

```env
# Example configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key
MISTRAL_API_KEY=your_mistral_api_key
FIREWORKS_API_KEY=your_fireworks_api_key
GROQ_API_KEY=your_groq_api_key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_key
CLERK_SECRET_KEY=your_clerk_secret_key

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

To dive deeper into the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.dev/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

## Contributing

Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

---

This README should provide a comprehensive overview of your project and guide users through setup, usage, and further exploration.
