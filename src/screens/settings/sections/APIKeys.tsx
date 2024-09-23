import CardContent from "@/components/v2/CardContent";
import Input from "@/components/v2/Input";

const APIKeys = () => {
  return (
    <CardContent title="API Keys" overrideStyles="xl:col-span-2">
      <Input title="Open AI" />
      <Input title="Anthropic" />
      <Input title="Google Generative AI" />
      <Input title="Mistral" />
      <Input title="Fireworks" />
      <Input title="Grooq" />
    </CardContent>
  );
};

export default APIKeys;
