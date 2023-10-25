import { Container} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import BookEditPostForm from 'src/sections/@dashboard/book/BookEditPostForm';
export default function BookEditPage() {
    const { themeStretch } = useSettingsContext();
  
 
    return (
      <>
          <Helmet>
              <title>{`Book | Minimal UI`}</title>
          </Helmet>
  
          <Container maxWidth={themeStretch ? false : 'lg'}>
              <CustomBreadcrumbs
                  heading="Update Book"
                  links={[
                      {
                        name: 'Dashboard',
                        href: PATH_DASHBOARD.root,
                      },
                      {
                        name: 'Book',
                        href: PATH_DASHBOARD.book.post,
                      },
                      {
                        name: 'Update book',
                      },
                  ]}
              />
               <BookEditPostForm />
          </Container>
      </>
    )
}
