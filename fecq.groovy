plan(key:'FECQ',name:'Front-End Code Quality Build',description:'Runs some ESLint rules on the repo, and pushes the results through git-ratchet.') {

  project(key:'CONNECT',name:'Connect')

  repository(name:'Atlassian Connect JS (master)')

  trigger(type:'polling',strategy:'periodically',frequency:'180') {
    repository(name:'Atlassian Connect JS (master)')
  }

  stage(name:'Default Stage') {
    ratcheted_eslint_job(
      repoName: 'Atlassian Connect JS (master)',
      repoUrl: 'ssh://git@stash.atlassian.com:7997/ac/atlassian-connect-js.git'
    )
  }
}
