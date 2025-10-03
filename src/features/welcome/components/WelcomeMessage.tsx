import { Button } from '@/common';
import { useWelcome } from '../hooks';

export const WelcomeMessage = () => {
  const { message, version, contributors } = useWelcome();

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold tracking-tight">{message}</h1>
      <p className="text-sm text-muted-foreground">v{version}</p>
      {contributors.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Contributors: {contributors.join(', ')}
        </p>
      )}
      <div className="pt-2">
        <Button>Get Started</Button>
      </div>
    </div>
  );
};
