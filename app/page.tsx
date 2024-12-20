import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
const HomePage = () => {
  return (
    <div>
      <Button variant={'destructive'} size={'lg'}>
        Hello bhai click karo mereko
      </Button>

      <UserButton/>
    </div>
  );
};

export default HomePage;
