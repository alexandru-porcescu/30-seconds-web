import React from 'react';
import Anchor from 'atoms/anchor';
import PropTypes from 'prop-types';
import { Link as LinkPropType } from 'typedefs';
import { trimWhiteSpace } from 'functions/utils';

/**
 * Anchor component for linking back to the previous page.
 */
export const LinkBackAnchor = ({
  children,
  link,
  className,
  ...rest
}) =>
  (
    <Anchor
      className={ trimWhiteSpace`link-back icon icon-arrow-left${className}` }
      link={ link }
      { ...rest }
    >
      { children }
    </Anchor>
  );

LinkBackAnchor.propTypes = {
  /** Children elements */
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  /** Anchor link data */
  link: LinkPropType.isRequired,
  /** Additional class names for the anchor */
  className: PropTypes.string,
  /** Any other props to be passed to the component */
  rest: PropTypes.any,
};

/**
 * Breadcrumbs component for linking back to the previous page.
 */
const Breadcrumbs = ({
  breadcrumbs,
  lastPage,
}) => {
  if(
    breadcrumbs.length === 1 && lastPage.name.length &&
    breadcrumbs[0].name.toLowerCase() !== lastPage.name.toLowerCase() &&
    breadcrumbs[0].name.toLowerCase() === 'blog'
  ) {
    if (lastPage.link.url.includes('/t/')) {
      const orderingSegment = lastPage.link.url.includes('/a/')
        ? '/a/' : lastPage.link.url.includes('/e/')
          ? '/e/' : '/p/';
      const lastPageName = lastPage.name.split(' ').slice(1);
      const firstPageUrl = `${lastPage.link.url.slice(0, lastPage.link.url.indexOf('/t/'))}/p/1`;
      const firstPageName = lastPage.name.split(' ').slice(0, 1);
      return (
        <>
          <LinkBackAnchor
            className='has-more'
            link={ {
              ...lastPage.link,
              url: firstPageUrl.replace('/p/', orderingSegment),
            } }
          >
            { firstPageName }
          </LinkBackAnchor>
          { ' / ' }
          <Anchor
            className='link-back-more'
            link={ lastPage.link }
          >
            { lastPageName }
          </Anchor>
        </>
      );
    } else {
      return (
        <LinkBackAnchor
          link={ lastPage.link }
        >
          { lastPage.name }
        </LinkBackAnchor>
      );
    }
  } else if(
    lastPage.link.url.includes('search') ||
    lastPage.name.toLowerCase() === 'snippet list' ||
    lastPage.name.toLowerCase() === breadcrumbs[0].name.toLowerCase()
  ) {
    return (
      <LinkBackAnchor
        link={ lastPage.link }
      >
        { lastPage.name }
      </LinkBackAnchor>
    );
  } else if (breadcrumbs.length > 1 && lastPage.name.toLowerCase() === breadcrumbs[1].name.toLowerCase()) {
    const orderingSegment = lastPage.link.url.includes('/a/')
      ? '/a/' : lastPage.link.url.includes('/e/')
        ? '/e/' : '/p/';
    const lastPageName = lastPage.name.includes(breadcrumbs[0].name)
      ? lastPage.name.slice(breadcrumbs[0].name.length + 1) : lastPage.name;
    return (
      <>
        <LinkBackAnchor
          className='has-more'
          link={ {
            ...breadcrumbs[0].link,
            url: breadcrumbs[0].link.url.replace('/p/', orderingSegment),
          } }
        >
          { breadcrumbs[0].name }
        </LinkBackAnchor>
        { ' / ' }
        <Anchor
          className='link-back-more'
          link={ lastPage.link }
        >
          { lastPageName }
        </Anchor>
      </>
    );
  } else {
    return (
      <>
        <LinkBackAnchor
          className={ breadcrumbs.length > 1 ? 'has-more' : '' }
          link={ breadcrumbs[0].link }
        >
          { breadcrumbs[0].name }
        </LinkBackAnchor>
        { breadcrumbs.length > 1 && ' / ' }
        { breadcrumbs.length > 1 &&
          <Anchor
            className='link-back-more'
            link={ breadcrumbs[1].link }
          >
            { breadcrumbs[1].name.includes(breadcrumbs[0].name)
              ? breadcrumbs[1].name.slice(breadcrumbs[0].name.length + 1)
              : breadcrumbs[1].name
            }
          </Anchor>
        }
      </>
    );
  }
};

Breadcrumbs.propTypes = {
  /** Breadcrumbs data */
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      link: LinkPropType,
      name: PropTypes.string,
    })
  ),
  /** Last page data */
  lastPage: PropTypes.shape({
    link: LinkPropType,
    name: PropTypes.string,
  }),
};

export default Breadcrumbs;
