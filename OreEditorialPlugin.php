<?php

/**
 * @file OreEditorialPlugin.php
 *
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @brief Editorial-workflow nudges (starting with a "VoR needs to be published" notice).
 */

namespace APP\plugins\generic\oreEditorial;

use APP\core\Application;
use APP\template\TemplateManager;
use PKP\plugins\GenericPlugin;

class OreEditorialPlugin extends GenericPlugin
{
    public function register($category, $path, $mainContextId = null)
    {
        if (!parent::register($category, $path, $mainContextId)) {
            return false;
        }

        if ($this->getEnabled($mainContextId)) {
            $request = Application::get()->getRequest();
            $templateMgr = TemplateManager::getManager($request);

            $templateMgr->addJavaScript(
                'oreEditorial',
                "{$request->getBaseUrl()}/{$this->getPluginPath()}/public/build/build.iife.js",
                [
                    'inline' => false,
                    'contexts' => ['backend'],
                    'priority' => TemplateManager::STYLE_SEQUENCE_LAST,
                ]
            );
        }

        return true;
    }

    public function getDisplayName()
    {
        return __('plugins.generic.oreEditorial.displayName');
    }

    public function getDescription()
    {
        return __('plugins.generic.oreEditorial.description');
    }
}
