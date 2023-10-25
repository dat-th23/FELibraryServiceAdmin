import { Container, Divider, Pagination, Stack,Typography } from '@mui/material';
import React,{useEffect, useState} from 'react'
import { Helmet } from 'react-helmet-async';
import { IBlogPost } from 'src/@types/blog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { fetchCategoriesThunk } from 'src/redux/slices/category';
import { useDispatch } from 'src/redux/store';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { BlogNewPostForm, BlogPostCommentForm, BlogPostCommentList, BlogPostHero, BlogPostTags } from 'src/sections/@dashboard/blog';
import BookNewPostForm from 'src/sections/@dashboard/book/BookNewPostForm';
import Markdown from '../../../components/markdown';


export default function BookPostPage() {
    const { themeStretch } = useSettingsContext();
  return (
    <>
        <Helmet>
            <title>{`Book | Minimal UI`}</title>
        </Helmet>

        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Create Book"
                links={[
                    {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                    },
                    {
                    name: 'Blog',
                    href: PATH_DASHBOARD.blog.root,
                    },
                    {
                    name: 'create book',
                    },
                ]}
            />
             <BookNewPostForm />
        </Container>
    </>
  )
}
