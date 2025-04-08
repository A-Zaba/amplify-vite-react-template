import type { Schema } from '../amplify/data/resource';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { signOut } = useAuthenticator();

  const sendPrompt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending prompt:", prompt);

      const { data, errors } = await client.queries.generateHaiku({
        prompt
      });

      if (errors) {
        console.error("Errors:", errors);
        setError('Failed to generate haiku. Please try again.');
        return;
      }

      setAnswer(data);
      setPrompt('');
    } catch (error) {
      console.error("Error generating haiku:", error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 dark:text-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">Haiku Generator</h1>
        
        <form className="mb-4" onSubmit={sendPrompt}>
          <div className="flex flex-col gap-4">
            <input
              className="text-black p-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter a prompt..."
              name="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              disabled={isLoading}
              aria-label="Haiku prompt input"
            />
            
            <button
              type="submit"
              className={`p-2 rounded-md ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium`}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Haiku'}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 text-center mb-4" role="alert">
            {error}
          </div>
        )}

        {answer && (
          <div className="text-center bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <pre className="whitespace-pre-wrap font-serif text-lg">
              {answer}
            </pre>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={signOut}
            className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
