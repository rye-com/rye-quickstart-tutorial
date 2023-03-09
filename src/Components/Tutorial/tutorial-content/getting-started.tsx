import RyeApiKeyV2 from '../../../assets/rye-key-v2.png';
import ListItem from '../styled-components/list-item';

export default function GettingStarted() {
  return (
    <ol className="list-inside list-decimal text-paragraph-medium font-semibold">
      <ListItem content="Sign up and log in to" />
      <ListItem
        styleOverrides={{ paragraph: 'inline-block mb-[12px]' }}
        content="Under Account → Access and Security, view and copy your API key"
      >
        <img src={RyeApiKeyV2} alt="API Key" />
      </ListItem>
      <ListItem content="Enter your Rye API key" />
      <ListItem content="Now you can use your API key to access the Rye API throughout the tutorial">
        <p className="mb-[12px] text-paragraph-small font-normal">
          See below for the code snippet to call the Rye API:
        </p>
      </ListItem>
    </ol>
  );
}
