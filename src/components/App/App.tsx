import { Grid } from '~/components/Grid';
import { RemoveItemsContextController } from '~/contexts/RemoveItemsContext';

export const App = () => {
  return (
    <RemoveItemsContextController>
      <Grid />
    </RemoveItemsContextController>
  )
}
