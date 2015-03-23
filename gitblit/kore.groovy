import com.gitblit.GitBlit
import com.gitblit.Keys
import com.gitblit.models.RepositoryModel
import com.gitblit.models.UserModel
import com.gitblit.utils.JGitUtils
import org.eclipse.jgit.lib.Repository
import org.eclipse.jgit.revwalk.RevCommit
import org.eclipse.jgit.transport.ReceiveCommand
import org.eclipse.jgit.transport.ReceiveCommand.Result
import org.slf4j.Logger

/**
 * Sample Gitblit Post-Receive Hook: kore
 *
 * The Post-Receive hook is executed AFTER the pushed commits have been applied
 * to the Git repository.  This is the appropriate point to trigger an
 * integration build or to send a notification.
 * 
 * This script is only executed when pushing to *Gitblit*, not to other Git
 * tooling you may be using.
 * 
 * If this script is specified in *groovy.postReceiveScripts* of gitblit.properties
 * or web.xml then it will be executed by any repository when it receives a
 * push.  If you choose to share your script then you may have to consider
 * tailoring control-flow based on repository access restrictions.
 *
 * Scripts may also be specified per-repository in the repository settings page.
 * Shared scripts will be excluded from this list of available scripts.
 * 
 * This script is dynamically reloaded and it is executed within it's own
 * exception handler so it will not crash another script nor crash Gitblit.
 * 
 * Bound Variables:
 *  gitblit			Gitblit Server	 			com.gitblit.GitBlit
 *  repository		Gitblit Repository			com.gitblit.models.RepositoryModel
 *  receivePack		JGit Receive Pack			org.eclipse.jgit.transport.ReceivePack
 *  user			Gitblit User				com.gitblit.models.UserModel
 *  commands		JGit commands 				Collection<org.eclipse.jgit.transport.ReceiveCommand>
 *	url				Base url for Gitblit		String
 *  logger			Logs messages to Gitblit 	org.slf4j.Logger
 *  clientLogger	Logs messages to Git client	com.gitblit.utils.ClientLogger
 *
 * Accessing Gitblit Custom Fields:
 *   def myCustomField = repository.customFields.myCustomField
 *  
 */

 
 // Indicate we have started the script
logger.info("kore hook triggered by ${user.username} for ${repository.name}")

def koreUrl = "http://requestb.in/18lz2sd1"

def repo = repository.name
def summaryUrl
def commitUrl

if (gitblit.getBoolean(Keys.web.mountParameters, true)) {
	repo = repo.replace('/', gitblit.getString(Keys.web.forwardSlashCharacter, '/')).replace('/', '%2F')
	summaryUrl = url + "/summary/$repo"
	commitUrl = url + "/commit/$repo"
} else {
	summaryUrl = url + "/summary?r=$repo"
	commitUrl = url + "/commit?r=$repo&h="
}

Repository r = gitblit.getRepository(repository.name)

// get the recent command
def recentCommand = commands[commands.size()-1]
def commits = JGitUtils.getRevLog(r, recentCommand.oldId.name, recentCommand.newId.name).reverse()

// get recent commit
def recentCommit = commits[0]
def recentMessage = recentCommit.fullMessage

// define the trigger url
def triggerUrl = "${koreUrl}?repo=${repository.name}&user=${user.username}&summaryUrl=${summaryUrl}&commitUrl=${commitUrl}&message=${recentMessage}"

// trigger the build
def _url = new URL(triggerUrl)
def _con = _url.openConnection()

// set up connection
_con.setRequestMethod("POST")
_con.setRequestProperty("User-Agent", "Gitblit")

// send post request
_con.setDoOutput(true)

logger.info("Kore response code: ${_con.responseCode}")
