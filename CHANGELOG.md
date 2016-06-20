0.1.42 / 2014-06-19
==================
  * Added changelog
  * Temporarily remove ability to render on server (was broken anyway)
  * Refactored with some breaking changes
- Element not created by Dominic will not take defaults configs from parent.
    This was supported in 0.1.41
- API changed to `Dominic.create` from `Dominic.createElement`. This
    is to make it easier when combine with creating component
  * #### Creating children with template now have more helpers
1. push (now real push, previous was reset)
2. insert
3. remove
4. pop
5. shift
6. unshift
  * #### Support multiple templates observing same property
  * #### Now support predefined component to help avoid some repeatitive
1. `Dominic.register(name, creatorFunction)`
2. `Dominic.create({ ctype: 'component-name' })`
