import { PostShowPage } from '@/app/_components/pages/PostShowPage';
import { postService } from '@/app/_services/post.service';

interface PostShowPageProps {
  params: Promise<{
    slug: string
  }>;
}

export default async function PostPage({params}: PostShowPageProps){
  const { slug }= await params;

  return <PostShowPage slug={slug}></PostShowPage>
}

export async function generateMetadata({ params }: PostShowPageProps) {
  const { slug } = await params;
  const post = await postService.findBySlug(slug);

  if (!post) {
    return {
      title: 'Post não encontrado',
    };
  }

  return {
    title: `${post.title} | NE1 Notícias`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.photoUrl ? [post.photoUrl] : [],
      siteName: 'NE1 Notícias',
    },
  };
}