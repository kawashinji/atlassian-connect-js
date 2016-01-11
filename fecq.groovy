plan(key:'FECQ',name:'Front-End Code Quality Build',description:'Runs some ESLint rules on the repo, and pushes the results through git-ratchet.') {

  repoName = 'Atlassian Connect JS'
  repoUrl = 'ssh://git@stash.atlassian.com:7997/ac/atlassian-connect-js.git'

  project(key:'CONNECT',name:'Connect')

  repository(name:repoName)

  trigger(type:'polling',strategy:'periodically',frequency:'180') {
    repository(name:repoName)
  }

  stage(name:'Default Stage') {
    ratcheted_eslint_job(
      repoName: repoName,
      repoUrl: repoUrl
    )
  }
}
