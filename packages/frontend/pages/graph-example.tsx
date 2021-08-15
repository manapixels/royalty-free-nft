import { gql, useQuery } from '@apollo/client'
import { Alert, AlertIcon, Box, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/layout/Layout'

const COMPOUND_MARKETS = gql`
  query GetAllIpNfts {
    ipNfts(first: 10) {
      id
      licensor
    }
  }
`

function GraphExampleIndex(): JSX.Element {
  const { loading, error, data } = useQuery(COMPOUND_MARKETS)

  console.log(data)

  return (
    <Layout>
      <Heading as="h1" mb="12">
        The Graph Query Page
      </Heading>
      {loading && (
        <Alert status="warning">
          <AlertIcon />
          ... Loading
        </Alert>
      )}
      {error && (
        <Alert status="error">
          <AlertIcon />
          There was an error processing your request
        </Alert>
      )}
      {!loading &&
        !error &&
        data.ipNfts.map(({ id, licesor }) => (
          <Box key={id} mt="8">
            <Text>Name: {licensor}</Text>
          </Box>
        ))}
    </Layout>
  )
}

export default GraphExampleIndex
