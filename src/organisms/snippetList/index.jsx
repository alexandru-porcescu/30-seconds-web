import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paginator from 'molecules/paginator';
import { AnchorButton } from 'atoms/button';
import Sorter from 'molecules/sorter';
import PageTitle from 'atoms/pageTitle';
import PageSubtitle from 'atoms/pageSubtitle';
import { onRouteUpdate } from '../../../gatsby-browser';
import PreviewCard from 'molecules/previewCard';
import ListingAnchors from 'molecules/listingAnchors';
import {
  Snippet as SnippetPropType,
  Paginator as PaginatorPropType
} from 'typedefs';
import _ from 'lang';
const _l = _('en');

// eslint-disable-next-line complexity
const SnippetList = ({
  snippetList,
  paginator,
  sorter,
  listingName,
  listingType,
  listingSublinks = [],
  infiniteScrollEnabled,
}) => {
  const [previousPage, setPreviousPage] = React.useState(paginator.pageNumber > 1 ? paginator.pageNumber - 1 : null);
  const [nextPage, setNextPage] = React.useState(paginator.pageNumber < paginator.totalPages ? paginator.pageNumber + 1 : null);
  const [currPage, setCurrPage] = React.useState(paginator.pageNumber);
  const [shownPages, setShownPages] = React.useState(1);
  const [snippets, setSnippets] = React.useState(snippetList);
  React.useEffect(() => {
    const scrollHandler = p => () => {
      const page = Math.ceil((document.querySelector('.content').scrollTop / (document.querySelector('.content').scrollHeight - document.querySelector('.content').clientHeight)) * (p + 1));
      console.log(`${page <= 1 ? 1 : page >= p ? p : page} of ${p}`);
    };
    document.querySelector('.content').removeEventListener('scroll', scrollHandler(shownPages - 1));
    document.querySelector('.content').addEventListener('scroll', scrollHandler(shownPages));
  }, [shownPages]);
  return snippets.length ? (
    <>
      {
        listingSublinks.length
          ? <ListingAnchors isCompact={ listingType !== 'main' } items={ listingSublinks } />
          : null
      }
      <PageTitle isLight className='with-sorter'>
        { listingName }
      </PageTitle>
      <Sorter sorter={ sorter } />
      {
        infiniteScrollEnabled && previousPage ? (
          <AnchorButton
            link={ {
              internal: true,
              url: `${paginator.baseUrl}/${paginator.slugOrderingSegment}/${previousPage}`,
            } }
            onClick={ e => {
              if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
                e.preventDefault();
                fetch(`/page-data${paginator.baseUrl}/${paginator.slugOrderingSegment}/${previousPage}/page-data.json`)
                  .then(response => response.json())
                  .then(json => {
                    console.log(shownPages);
                    setSnippets([...json.result.pageContext.snippetList, ...snippets]);
                    window.history.pushState(
                      listingName,
                      listingName,
                      `${paginator.baseUrl}/${paginator.slugOrderingSegment}/${previousPage}`
                    );
                    setShownPages(shownPages + 1);
                    onRouteUpdate({ location: `${paginator.baseUrl}/${paginator.slugOrderingSegment}/${previousPage}`});
                    setPreviousPage(previousPage > 1 ? previousPage - 1 : null);
                  });
              }
            } }>
            Load previous
          </AnchorButton>
        ) : null
      }
      { snippets.map(snippet => (
        <PreviewCard
          key={ `snippet_${snippet.url}` }
          snippet={ snippet }
          context={ listingType }
        />
      )) }
      { infiniteScrollEnabled && nextPage ? (
        <p>Load more</p>
      ) : (
        <Paginator paginator={ paginator } />
      )
      }
    </>
  ) : null;
};

SnippetList.propTypes = {
  /** List of snippets to be displayed */
  snippetList: PropTypes.arrayOf(SnippetPropType),
  /** Paginator component data */
  paginator: PaginatorPropType,
  /** Sorter component data */
  sorter: PaginatorPropType,
  /** Name of this snippet list */
  listingName: PropTypes.string,
  /** Type of this snippet list */
  listingType: PropTypes.string,
  /** Links to sublists */
  listingSublinks: PropTypes.arrayOf(PropTypes.shape({})),
};


export default connect(
  state => ({
    infiniteScrollEnabled: state.shell.infiniteScrollEnabled,
  }),
  null
)(SnippetList);
