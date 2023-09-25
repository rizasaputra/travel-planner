
import { useTheme, View, Flex, Image, Text, Heading } from '@aws-amplify/ui-react';
import { useTranslation } from "react-i18next";

import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { tokens } = useTheme();

  const { t } = useTranslation();
  
  return (
    <div className="header">
      <Flex
        direction="row"
        justifyContent="space-between"
        alignContent={"center"}
      >
        <View textAlign="left" padding={tokens.space.large}>
          <a href="https://aws.amazon.com/what-is-cloud-computing">
            <Image
              src="https://d0.awsstatic.com/logos/powered-by-aws.png" 
              alt="Powered by AWS Cloud Computing"
              height="40px" 
            />
          </a>
        </View>

        <Heading padding={tokens.space.large} level={1}>{t("app")}</Heading>

        <View padding={tokens.space.large}>
          <Text display="inline-block">{t("language")}:</Text> <LanguageSwitcher />
        </View>
      </Flex>
    </div>
  );
};

export default Header;